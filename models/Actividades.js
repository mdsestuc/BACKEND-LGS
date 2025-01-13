const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Definir Schema
const ActividadesSchema = Schema({
    idrubro: {
        type: Schema.Types.ObjectId,
        ref: 'Rubro',
        //required: true,
    },
    nombre: {
        type: String,
        required: true,
        unique: true,
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
ActividadesSchema.pre('save', async function (){
    console.log(this);
    this.updated_at = new Date();
});
//pagination
ActividadesSchema.plugin(mongoosePaginate);
// Definimos el modelo con el Schema
module.exports = mongoose.model('Actividades', ActividadesSchema);