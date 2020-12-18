const express = require("express");
const router = express.Router();

const {confirmarRegistro} = require('../controller/registro');
const {verificarLogin, Conectado, cerrarSession} = require("../controller/login");

router.post("/registrarse", confirmarRegistro);
router.post("/Login", verificarLogin);
router.get("/Conectado", Conectado);
router.get("/cerrarSession", cerrarSession);

module.exports = router;