const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Definir Schema
const NomfacSchema = new Schema({
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
NomfacSchema.pre('save', async function (){
    console.log(this);
    this.updated_at = new Date();
});
//pagination
NomfacSchema.plugin(mongoosePaginate);
// Definimos el modelo con el Schema
module.exports = mongoose.model('Nomfac', NomfacSchema);