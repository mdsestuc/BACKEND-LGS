const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definir Schema
const ImgProductoSchema = new Schema({
    imgprincipal: {
        type: String,
        required: false,
        trim: true
    },
    img: {
        type: [],
        required: false,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
});
//esto es para update_at
ImgProductoSchema.pre('save', async function (){
    console.log(this);
    this.updated_at = new Date();
});
module.exports = mongoose.model('ImgProducto', ImgProductoSchema);