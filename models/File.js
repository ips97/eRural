const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const File = new Schema({
    nome: String,
    size: Number,
    key: String,
    // url: String,
    createdAt: {
        type: Date,
        default: Date.now
    }


});


mongoose.model("files", File)


