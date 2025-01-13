const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Definir Schema
const ProductoSchema = new Schema({
    codi : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    stock6: {
        type: Number,
        default: 0
    },
    prpu: {
        type: Number,
        required: true
    },
    prcon: {
        type: Number,
        required: true
    },
    disponible: {
        type: Boolean,
        default: false,
    },
    destacado: {
        type: Boolean,
        default: false,
    },
    imgproductoid: {
        type: Schema.Types.ObjectId,
        ref: 'ImgProducto',
        required: false,
        default: null,
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
ProductoSchema.pre('save', async function (){
    console.log(this);
    this.updated_at = new Date();
});
//pagination
ProductoSchema.plugin(mongoosePaginate);
// Definimos el modelo con el Schema
module.exports = mongoose.model('Producto', ProductoSchema);