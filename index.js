require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes/routes");
const path = require("path");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const {createServer} = require("http")
const {Server} = require("socket.io");
const httpServer = createServer(app)



// Configuração
    // Bodyparser
        app.use(express.json());
        app.use(express.urlencoded({ extended: true}));
    // Flash
        app.use(session({
            secret: "eRural",
            resave: true,
            saveUninitialized: true
        }));
        app.use(flash())

    // Middleware de Mensagem
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            res.locals.error = req.flash("error");
            res.locals.user = req.user || null;
            next();
        });
    // Public
        // Indica onde está os arquivos staticos (css, js)
        app.use(express.static(path.join(__dirname, 'public')));
    // Banco de Dados (MongoDB/Mongoose)
        mongoose.connect(process.env.MONGO_URL).then(() =>{
            console.log("Conectado ao mongo");
        }).catch((err) =>{
            console.log("Erro ao se conectar: " + err);
        });
    // Views Engine
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main',
        runtimeOptions:{
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,}
        }));
        app.set('view engine', 'handlebars');
    
        
// Rotas
app.use("/", routes)






const io = new Server(httpServer)
var user;
const users = []
io.on("connection", (socket)=>{    
    
    socket.on("select_room", (data)=>{
       socket.join(data.room);
       sala = data.room
       user = data.username;
       let userOnRoom = users.filter(user => user.room == data.room)
        let userInRoom = users.find((user) => user.username == data.username)
        
        if(userInRoom){
            userInRoom.socket_id = socket.id;
        }else{
            var datas = {
                room: sala,
                socket_id: socket.id,
                username: user
                }
            users.push(datas)
                console.log(user, "entrou na sala: ",sala)   
                io.emit("update_user", users)
                console.log(`Usuários conectados na ${data.room}: `, userOnRoom.length+1)
        }
        
        
        
    
        socket.on("disconnect", ()=>{
            users.pop(user)
            console.log(`${user} saiu`)
            user = ""; 
            io.emit("update_user", users)
            console.log(`Usuários conectados na ${data.room}: `, userOnRoom.length)
        })
        

        
    })

    
})



httpServer.listen(process.env.PORT, ()=>{
    console.log("Servidor On-line")
}) 


