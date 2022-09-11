const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Sala = new Schema({
    nome: {
        type: String,
        require: true,
        unique: true
    },
    file:{
        type: Schema.Types.ObjectId,
        ref: "files",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

mongoose.model("salas", Sala);