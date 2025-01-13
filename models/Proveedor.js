const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Definir Schema
const ProveedorSchema = new Schema({
    codigo : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    domicilio: {
        type: String,
        trim: true
    },
    codpostal: {
        type: Number,
        default: 0
    },
    provincia: {
        type: String,
        trim: true
    },
    observaciones: {
        type: String,
        trim: true
    },
    saldo:{
        type: Number,
        default: 0
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
ProveedorSchema.pre('save', async function (){
    console.log(this);
    this.updated_at = new Date();
});
//pagination
ProveedorSchema.plugin(mongoosePaginate);
// Definimos el modelo con el Schema
module.exports = mongoose.model('Proveedor', ProveedorSchema);