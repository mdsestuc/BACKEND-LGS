const Tipofac = require("../models/Tipofac")
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

exports.crearTipofac = async (req, res) => {

    const errores = validationResult(req);
    console.log(req.body)
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }       
    const { 
            nombre,
          } = req.body;

    try {
      //valido si ya existe el tipo de factura
      let buscar = await Tipofac.findOne({ nombre });
      if (buscar) {
        return res.status(400).json({ msg: "Tipo de factura ya esta registrado" });
      }

      //creo el nuevo tipo de factura
      let tipofac = new Tipofac(req.body);
  
      //guardar proveedor
      await tipofac.save();

      return res.json({ msg: "Tipo de factura Creada Correctamente." });

  
    } catch (error) {
      res.status(400).send("Hubo un error");
    }
}
// Listar Todos los tipos d facturas
exports.listartipofac = async (req, res) => {
  try {
      const { pagina, porpagina } = req.query;
      const options = {
          page : parseInt(pagina,10),
          limit : parseInt(porpagina,10),
      }
      const tipofac = await Tipofac.paginate({},options);
      res.json({ tipofac });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Tipos de Facturas.' });
  }
}