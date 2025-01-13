const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Definir Schema
const PedidoSchema = new Schema({
    idusuario : {
        type: String,
        required: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    cantotal: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    impreso: {
        type: Boolean,
        default: false,
    },
    observaciones: {
        type: String,
        trim: true
    },
    pedidodetalle: {
        type: [],
        required: true
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
PedidoSchema.pre('save', async function (){
    console.log(this);
    this.updated_at = new Date();
});
//pagination
PedidoSchema.plugin(mongoosePaginate);
// Definimos el modelo con el Schema
module.exports = mongoose.model('Pedido', PedidoSchema);