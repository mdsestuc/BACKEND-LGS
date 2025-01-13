const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Definir Schema
const ProvemovSchema = new Schema({
    proveid:{
        type: Schema.Types.ObjectId,
        ref: 'Proveedor'
    },
    tipofacid:{
        type: Schema.Types.ObjectId,
        ref: 'Tipofac'
    },
    nomfacid:{
        type: Schema.Types.ObjectId,
        ref: 'Nomfac'
    },
    numfac: {
        type: String,
        required: true,
        trim: true
    },
    fechafac: {
        type: Date,
        required: true,
        trim: true
    },
    fechaing: {
        type: Date,
        required: true,
        trim: true
    },
    gravado: {
        type: Number,
        default: 0
    },
    iva: {
        type: Number,
        default: 0
    },
    impuesto: {
        type: Number,
        default: 0
    },
    total:{
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
ProvemovSchema.pre('save', async function (){
    console.log(this);
    this.updated_at = new Date();
});
//pagination
ProvemovSchema.plugin(mongoosePaginate);
// Definimos el modelo con el Schema
module.exports = mongoose.model('Provemov', ProvemovSchema);