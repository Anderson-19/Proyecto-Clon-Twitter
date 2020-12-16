const express = require("express");
const router = express.Router();
const {changeAvatar, downloadAvatar, downloadMedia, subirArchivos} = require("../controller/files")

router.post("/upload", changeAvatar);
router.post("/getAvatar", downloadAvatar);
router.post("/getPostMedia", downloadMedia);
router.post("/subirArchivos", subirArchivos);

module.exports = router;