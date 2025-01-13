const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    require: true,
    trim: true,
  },
  apellido: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  documento: {
    type: Number,
    required: true
  },
  changepassword: {
    type: Boolean,
    default: true,
  },
  rol: {
    type: String,
    default: 'Consulta',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  create_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now()
  }
});
//esto es para update_at
UsuarioSchema.pre('save', async function (){
  console.log(this);
  this.updated_at = new Date();
});
//pagination
UsuarioSchema.plugin(mongoosePaginate);
// Definimos el modelo con el Schema
module.exports = mongoose.model("Usuario", UsuarioSchema);
