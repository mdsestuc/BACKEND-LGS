const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Definir Schema
const BeneficiariosSchema = new Schema({
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
  documento: {
    type: Number,
    required: true
  },
  idprovincia : {
    type: String,
    //required: true,
    trim: true
  },
  provincia : {
    type: String,
    //required: true,
    trim: true
  },
  iddepartamento : {
    type: String,
    //required: true,
    trim: true
  },
  departamento : {
    type: String,
    //required: true,
    trim: true
  },
  idmunicipio : {
    type: String,
    //required: true,
    trim: true
  },
  municipio : {
    type: String,
    //required: true,
    trim: true
  },
  idlocalidad : {
    type: String,
    //required: true,
    trim: true
  },
  localidad : {
    type: String,
    //required: true,
    trim: true
  },
  domicilio : {
    type: String,
    //required: true,
    trim: true
  },
  numero : {
    type: String,
    //required: true,
    trim: true
  },
  piso : {
    type: String,
    //required: true,
    trim: true
  },
  cp : {
    type: String,
    trim: true
  },
  idsexo: {
    type: Schema.Types.ObjectId,
    ref: 'Generos',
    required: false,
    default: null,
  },
  idestudio: {
    type: Schema.Types.ObjectId,
    ref: 'Estudios',
    required: false,
    default: null,
  },
  jubilacion: {
    type: String,
    default: "No",
  },
  pension: {
    type: String,
    default: "No",
  },
  programasocialId: [{
    type: Schema.Types.ObjectId,
    ref: 'Programasocial'
  }],
  // observaciones: {
  //   type: String,
  //   trim: true
  // },
  fechanacimiento: {
    type: Date,
    //default: Date.now()
  },
  nrocel1: {
    type: String,
    //default: Date.now()
  },
  nrocel2: {
    type: String,
    //default: Date.now()
  },
  latitud: {
    type: Number,
    default: 0
  },
  longitud: {
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
BeneficiariosSchema.pre('save', async function (){
    console.log(this);
    this.updated_at = new Date();
});
//pagination
BeneficiariosSchema.plugin(mongoosePaginate);
// Definimos el modelo con el Schema
module.exports = mongoose.model('Beneficiarios', BeneficiariosSchema);