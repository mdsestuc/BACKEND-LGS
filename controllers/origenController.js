const Origen = require('../models/Origen');
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

// Listar Origen
exports.origen = async (req, res) => {
    try {
        const { limit, page } = req.query;
        const options = {
            sort : 'nombre',
            page : parseInt(page,10),
            limit : parseInt(limit,10),
        };
        const origen = await Origen.paginate({} , options);
        console.log(origen.docs, 'origen ingresa')
        res.json({ origen });
        //res.json({ cant} )
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Origen.' });
    }
  }