const express = require('express');
const morgan = require('morgan');
const mongoose = require('./database');
const router = express.Router();
const cors = require ('cors')

 
//Crear el servidor
const app = express();
 
// Puerto de la App
const dotenv = require('dotenv');
dotenv.config();

//habilitando cors
app.use(cors());
//Set Request Size Limit
//app.use(express.limit(100000000));
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//habilitar express.json
app.use(express.json({extend: true}))
app.use(express.urlencoded({ extended: true})); // for parsing application/x-www-form-urlencoded
// Puerto de la App
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(morgan('dev'));

//const formData = require('express-form-data')

//app.use(formData.parse())
// Rutas
app.use('/api', require('./routes/usuarios'));
// Definir la página principal

// Iniciar la App
app.listen(PORT, () => {
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
});
