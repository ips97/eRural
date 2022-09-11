const routes = require("express").Router();
const mongoose = require("mongoose");
const multer = require("multer");
const ConfigMulter = require("../Config/multer");
const sala = require("../Controller/controllerSalas")
require("../models/Salas");
const Sala = mongoose.model("salas")
require("../models/File");
const File = mongoose.model("files")



routes.get("/", (req, res)=>{
    res.render("index")
})

// Rotas da model Sala
routes.get("/salas", sala.allSalas)
routes.get("/salas/addSala", sala.formSalas)

routes.post("/salas/addSala", multer(ConfigMulter).single("file"), (req, res)=>{
    


        if(!req.file || req.file == null || req.file == "" || req.file == undefined){
            res.render("sala/formSala", {error: "Houve um erro no upload do arquivo, verifique os requisitos e tente novamente!", body: req.body})
        }else{
            const file = {
                nome: req.file.originalname, 
                size: req.file.size, 
                key: req.file.filename
            }
            
            new File(file).save().then((files)=>{
                
                req.flash("success_msg", "Upload feito com sucesso!")
                
                const sala = {nome: req.body.nomeSala, file: files._id}
                
                new Sala(sala).save().then(()=>{
                    req.flash("sucess_msg", "Sala criada com sucesso")
                    res.redirect("/salas")
                }).catch(err =>{
                    req.flash("error_msg", "Houve um erro na criação da Sala, verifique as informações e tente novamente.")
                    res.render("sala/formSala", {body: req.body})
                })
                
            }).catch(err =>{
                req.flash("error_msg", "Houve um erro no carregamento do arquivo, verifique os requisitos e tente novamente.")    
                res.render("sala/formSala", {body: req.body})
            })
            

        }
})

routes.get("/sala/:id", sala.viewSala)
routes.get("/video/i/:key", sala.video)


module.exports = routes;