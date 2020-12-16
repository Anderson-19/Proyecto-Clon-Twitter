const db = require("../db/postgres");
const encryptor = require("../encrypt/SHA-256");
const multiparty = require("multiparty");

const verify = (req, res) => {
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) =>{
        let {name, pass} = fields;
        name = JSON.stringify(name);
        pass = JSON.stringify(pass);
        name = name.split('"')[1];
        name = name.split('"')[0];
        pass = pass.split('"')[1];
        pass = pass.split('"')[0];
        let encryptedPass = encryptor.encrypt(pass);
        let query = "SELECT password FROM users WHERE username = $1";
        let params = [name];
        db.query(query, params, (err, success) => {
            if (err){
                res.status(500).send(err);
            }
            else{
                if (success.rows.length < 1) res.status(403).send("User not found.");
                else{
                    if (success.rows[0].password !== encryptedPass){
                        res.status(403).send("Incorrect password.");
                    }
                    else{
                        let session = req.session;
                        session.name = name;
                        res.status(200).send({'message':'ok'});
                    }
                }
            }
        })
    })
}

const LoggedIn = (req, res) => {
    let session = req.session;
    if (session.name) res.status(200).send("True");
    else res.status(200).send("False");
}

const LogOut = (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).send(err);
        res.status(200).send("Logged out");
    });
}

module.exports = {
    verify, LoggedIn, LogOut
}