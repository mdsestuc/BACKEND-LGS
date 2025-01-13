const Rubro = require('../models/Rubro');
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

// Listar Origen
exports.rubros = async (req, res) => {
    try {
        const { limit, page } = req.query;
        const options = {
            sort : 'nombre',
            page : parseInt(page,10),
            limit : parseInt(limit,10),
        };
        const rubro = await Rubro.paginate({} , options);
        console.log(rubro.docs, 'origen ingresa')
        res.json({ rubro });
        //res.json({ cant} )
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Rubro.' });
    }
  }