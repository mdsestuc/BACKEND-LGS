const Nomfac = require("../models/Nomfac")
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

exports.crearNomfac = async (req, res) => {

    const errores = validationResult(req);
    console.log(req.body)
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }       
    const { 
            nombre,
          } = req.body;

    try {
      //valido si ya existe el nombre de la factura
      let buscar = await Nomfac.findOne({ nombre });
      if (buscar) {
        return res.status(400).json({ msg: "El nombre ya esta registrado" });
      }

      //creo el nuevo nombre
      let nomfac = new Nomfac(req.body);
  
      //guardar nombre
      await nomfac.save();

      return res.json({ msg: "Nombre de factura Creada Correctamente." });

  
    } catch (error) {
      res.status(400).send("Hubo un error");
    }
}

// Listar Todos los nombres de facturas
exports.listarnomfac = async (req, res) => {
  try {
      const { pagina, porpagina } = req.query;
      const options = {
          page : parseInt(pagina,10),
          limit : parseInt(porpagina,10),
      }
      const nomfac = await Nomfac.paginate({},options);
      res.json({ nomfac });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Nombres de Facturas.' });
  }
}