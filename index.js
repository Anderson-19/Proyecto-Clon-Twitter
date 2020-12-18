const express =  require('express');
const rutaRegistro = require("./route/registro");
const session = require("express-session");
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(express.text());
app.use(express.json());
app.use(session({secret:'justdanceSecret', saveUninitialized:true, resave:true}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://localhost:5000");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Option, Option2");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.use("/registrarse-login", rutaRegistro);

app.listen(port);
