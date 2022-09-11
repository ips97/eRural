const mongoose = require("mongoose");
require("../models/Salas");
const Sala = mongoose.model("salas")
require("../models/File");
const File = mongoose.model("files");
const fs = require("fs");
const path = require("path")
const {v4: uuidV4} = require("uuid")


const allSalas = async (req, res)=>{
    Sala.find().then((salas)=>{
        res.render("sala/index", {sala: salas})
    }).catch(err=>{
        req.flash("error_msg", "Houve um erro interno ao carregar as Salas.")
        res.redirect("/")
    })
}


const formSalas = async (req, res) =>{
    res.render("sala/formSala")
}


const viewSala = async (req, res) =>{
    const {id} = req.params
      
    Sala.findOne({_id: id}).populate("file").then(sala =>{
         res.render("sala/viewSala", {sala: sala})
        ///res.redirect(`/${id}`)
    }).catch(err =>{
        req.flash("error_msg", "Houve um erro ao buscar sala selecionada.")
        res.redirect("/salas")
    })
}

const video = async (req, res) =>{
    const range = req.headers.range;
    const key = req.params.key
    

  const videoPath = `./public/videos/${key}`
  
  const videoSize = fs.statSync(videoPath).size;
 
  const chunkSize = 1 * 1e6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunkSize, videoSize - 1);
 
  const contentLength = end - start + 1;
 
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    
  };
  res.writeHead(206, headers);
 
  const stream = fs.createReadStream(videoPath, { start, end });
  stream.pipe(res);
  if(!videoPath){
    req.flash("error_msg", "Houve um erro ao carregar o vídeo")
  }
}


module.exports = {allSalas, formSalas, viewSala, video}