const Actividades = require('../models/Actividades');
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

// Listar actividades
exports.actividades = async (req, res) => {
    //const cant = await Generos.find({}).sort( { 'nombre':1}) ;
    //console.log(cant, 'genero')
    try {
        const { limit, page } = req.query;
        //console.log(page, 'page')
        //console.log(limit, 'limit')
        //console.log(req.query,'query')
        const options = {
            sort : 'nombre',
            //populate :  "rubro",
            page : parseInt(page,10),
            limit : parseInt(limit,10),
        };
        const actividades = await Actividades.paginate({} , options);
        console.log(actividades.docs, 'actividades')
        res.json({ actividades });
        //res.json({ cant} )
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Actividades.' });
    }
  }