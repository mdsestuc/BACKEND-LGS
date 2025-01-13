const Generos = require('../models/Generos');
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

// Listar generos
exports.genero = async (req, res) => {
    //const cant = await Generos.find({}).sort( { 'nombre':1}) ;
    //console.log(cant, 'genero')
    try {
        const { limit, page } = req.query;
        //console.log(page, 'page')
        //console.log(limit, 'limit')
        //console.log(req.query,'query')
        const options = {
            sort : 'nombre',
            page : parseInt(page,10),
            limit : parseInt(limit,10),
        };
        const genero = await Generos.paginate({} , options);
        console.log(genero.docs, 'genero')
        res.json({ genero });
        //res.json({ cant} )
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Generos.' });
    }
  }

