const dataBase = require("../model/postgres");
const emailValidator = require("email-validator");
const multiparty = require("multiparty");
const crypto = require("crypto");

const registrarUsuario = (Username, Email, Password, res) => {
    let queryString = "INSERT INTO users(username, email, password, privado) VALUES($1, $2, $3, 'true')";
    let hash = crypto.createHash('sha256').update(Password).digest("hex");
    let params = [Username, Email, hash];
    dataBase.query(queryString, params, (err) => {
        if (err){
            console.log(err.stack);
            res.status(500).send(err);
        }
        else{
            res.status(200).send({'message':'ok'});
        }
    })
}

const confirmarRegistro = (req, res) => {
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
            res.status(403).send({'massage':'Registro invalido'});
        } 
        else if (name.length > 25) {
            res.status(403).send({'massage':'Registro invalido'});
        } 
        else {
            if (validarPassword(pass)) {
                dataBase.query(queryString, param, (error, success) => {
                    if (error) {
                        res.status(500).send(err);
                    } 
                    else {
                        if (success.rows.length === 0) {
                            if (emailValidator.validate(email)){
                                registrarUsuario(name, email, pass, res);
                            }
                            else{
                                res.status(403).send("La dirección de correo electrónico es inválida.");
                            }
                        } 
                        else res.status(403).send("nombre de usuario ya existe.");
                    }
                })
            } 
            else {
                res.status(403).send("La longitud de la contraseña debe tener entre 6 y 32 caracteres. Registro fallido");
            }
        }
    })
}

const validarPassword = (password) => {
    return !(password.length < 6 || password.length > 32);
}

module.exports = {
    registrarUsuario, 
    confirmarRegistro
}