const multer = require("multer");
const path = require("path");
const crypto = require("crypto");


module.exports =  {
    // informa o destino do upload
    dest: path.resolve(__dirname, "./public/vídeos"),
    // 
    storage: multer.diskStorage({
        destination: (req, file, callback)=>{
            callback(null, path.resolve(__dirname, "../public/videos"))
        },
        // para alterar nome do arquivo e evitar nomes iguais
        filename: (req, file, callback) =>{
            crypto.randomBytes(16, (err, hash) =>{
                if(err){
                    callback(err)
                }
                const fileName = `${hash.toString("hex")}-${file.originalname}`;
                
                callback(null, fileName); 
                
            });
        }
    }),
    // informa os limites de upload
    limits: { 
        fileSize: 100 * 1024 * 1024
    },
    // filtra os tipos de arquivos 
    fileFilter: (req, file, callback) => {
        const TiposMimes = [ 
            "video/mp4",
            "video/webm", 
            "video/ogg",
        ];
        if (TiposMimes.includes(file.mimetype)){
            callback(null, true);
        }else{
            callback(null, false);          
        }
    }
    
}