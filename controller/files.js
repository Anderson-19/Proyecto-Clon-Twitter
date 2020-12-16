const fs = require("fs");
const multiparty = require("multiparty");
const del = require("del");
const db = require("../db/postgres");

const subirArchivos = async (req, res, next) =>
{
  const archivo = req.files.archivo;
  const fileName = archivo.name;
  const path = __dirname + '/../uploads/' + fileName;
    console.log(path);
  try {
    archivo.mv(path, (error) => {
      if (error) {
        console.error(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ status: 'error', message: error }));
          return;
        }
        res.status(200);
        res.send({'message':'archivo subido' });
        res.send({'archivo':fileName });
     });
   } catch (e) {
     res.status(500).json({
       error: true,
       message: e.toString()
     });
   }
}

const changeAvatar = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let form = new multiparty.Form();
        if (fs.existsSync(".../public/vistas/ImgUser/" + req.session.username)){
            del.sync("../public/vistas/ImgUser/" + req.session.username);
        }
        form.parse(req, (err, fields, files) => {
            let tipo = files.newAvatar[0].originalFilename.split(".")[1];
            let rutaArchivo = "../public/vistas/ImgUser/" + req.session.username;
            fs.mkdirSync(rutaArchivo);
            let absolutePath = "../public/vistas/ImgUser/" + req.session.username + "/" + req.session.username + "." + tipo;
            fs.readFile(files.newAvatar[0].path, (err, data) => {
                if (err) res.status(500).send(err);
                else{
                    fs.writeFile(absolutePath, data, (err) => {
                        if (err) res.status(500).send(err);
                        else{
                            res.status(200).send({'message':'Imagen'});
                            res.send({'archivo': req.session.username});
                        }
                    })
                    fs.unlink(files.newAvatar[0].path, (err) => {
                        if (err) console.log(err);
                    });
                }
            })
            let query = "UPDATE users SET hasavatar = $1, avatarpath = $2 WHERE username = $3";
            let params = [true, absolutePath, req.session.username];
            db.queryAsync(query, params).catch(err => {
                console.log(err);
            })
        })
    }
}

const downloadAvatar = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        if (req.body === ""){
            res.status(500).send("Body is empty");
        }
        else{
            let query = "SELECT hasavatar, avatarpath FROM users WHERE username = $1";
            let params = [req.body];
            db.query(query, params, (err, success) => {
                let path = "Server/media/avatars/noAvatar.jpeg";
                if (!err){
                    if(success.rows[0].hasavatar){
                        if (fs.existsSync(success.rows[0].avatarpath)){
                            path = success.rows[0].avatarpath;
                        }
                    }
                }
                let fileType = path.split(".")[1];
                fileType = (fileType === "jpeg" || fileType === "png" || fileType === "gif") ? "image/" + fileType : "video/mp4";
                let data = fs.readFileSync(path, {}, (err, data) => {
                    if (!err) return data;
                    else return false;
                });
                res.setHeader("Content-Type", fileType);
                res.send(data);
            })
        }
    }
}

const downloadMedia = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let filelocation = req.body;
        let fileType = req.body.split(".")[1];
        fileType = (fileType === "jpeg" || fileType === "png" || fileType === "gif") ? "image/" + fileType : "video/mp4";
        let data = fs.readFileSync(filelocation, {}, (err, data) => {
            if (!err) return data;
            else return false;
        });
        res.setHeader("Content-Type", fileType);
        res.send(data);
    }
}

module.exports = {
    downloadAvatar, changeAvatar, downloadMedia, subirArchivos
}
