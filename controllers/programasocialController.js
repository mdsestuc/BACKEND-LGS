const Programasocial = require("../models/Programasocial");
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

// Listar programas sociales
exports.listarprogramassociales = async (req, res) => {
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
        const progsocial = await Programasocial.paginate({} , options);
        console.log(progsocial.docs, 'Programas sociales')
        res.json({ progsocial });
        //res.json({ cant} )
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Programas sociales.' });
    }
  }