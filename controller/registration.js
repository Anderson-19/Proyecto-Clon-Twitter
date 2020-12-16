const db = require("../db/postgres");
const encryptor = require("../encrypt/SHA-256");
const emailValidator = require("email-validator");
const multiparty = require("multiparty");

const registerUser = (Username, Email, Password, res) => {
    let queryString = "INSERT INTO users(username, email, password, private) VALUES($1, $2, $3, 'true')";
    let params = [Username, Email, encryptor.encrypt(Password)];
    db.query(queryString, params, (err) => {
        if (err){
            console.log(err.stack);
            res.status(500).send(err);
        }
        else{
            console.log("User: " + Username + ". Registered at " + Date());
            res.status(200).send({'message':'ok'});
        }
    })
}

const checkDuplicate = (req, res) => {
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        let {name, email, pass} = fields;
        name = JSON.stringify(name);
        email = JSON.stringify(email);
        pass = JSON.stringify(pass);
        name = name.split('"')[1];
        name = name.split('"')[0];
        email = email.split('"')[1];
        email = email.split('"')[0];
        pass = pass.split('"')[1];
        pass = pass.split('"')[0];
        let queryString = "SELECT username FROM users WHERE username = $1";
        let param = [name];
        if (name.length < 1) {
            res.status(403).send("Username required. Registration failed.");
        } 
        else if (name.length > 25) {
            res.status(403).send("Username too long. Registration failed.");
        } 
        else {
            if (validatePassword(pass)) {
                db.query(queryString, param, (error, success) => {
                    if (error) {
                        res.status(500).send(err);
                    } 
                    else {
                        if (success.rows.length === 0) {
                            if (emailValidator.validate(email)){
                                registerUser(name, email, pass, res);
                            }
                            else{
                                res.status(403).send("E-Mail direction is invalid.");
                            }
                        } 
                        else res.status(403).send("Username already exists.");
                    }
                })
            } 
            else {
                res.status(403).send("Password length must be between 6 to 32 characters. Registration failed");
            }
        }
    })
}

const validatePassword = (passwordToValidate) => {
    return !(passwordToValidate.length < 6 || passwordToValidate.length > 32);
}

module.exports = {
    registerUser, 
    checkDuplicate
}