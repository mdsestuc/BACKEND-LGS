const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Definir Schema
const AtencionatpSchema = Schema({
    fechainicio: {
        type: Date,
        //require: true,
    },
    emprendimientonombre: {
        type: String,
        //require: true,
        trim: true,
    },
    idbeneficiario: {
        type: Schema.Types.ObjectId,
        ref: 'Beneficiarios',
        //required: true,
    },
    origen: [{
        type: Schema.Types.ObjectId,
        ref: 'Origen',
        //required: true,
        required: false,
        default: null,
    }],
    actividades: [{
        type: Schema.Types.ObjectId,
        ref: 'Actividades',
        //required: true,
    }],
    solicita: {
        type: String,
        //require: true,
        trim: true,
    },
    observaciones: {
        type: String,
        require: false,
        trim: true,
    },
    marcha:{
        type: String,
        //require: false,
        trim: true,
    },
    prioridad: {
        type: String,
        //require: false,
        trim: true,
    },
    idexperticie: {
        type: Schema.Types.ObjectId,
        ref: 'Experticie',
        //required: true,
    },
    visitas: [{
        type: Date,
        required: false,
    }],
    fechaatp: {
        type: Date,
        //require: true,
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
AtencionatpSchema.pre('save', async function (){
    console.log(this);
    this.updated_at = new Date();
});
//pagination
AtencionatpSchema.plugin(mongoosePaginate);
// Definimos el modelo con el Schema
module.exports = mongoose.model('Atencionatp', AtencionatpSchema);