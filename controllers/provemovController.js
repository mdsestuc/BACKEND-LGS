const Provemov = require("../models/Provemov");
const Proveedor = require("../models/Proveedor");
const Tipofac = require("../models/Tipofac");
const Nomfac = require("../models/Nomfac");
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');

exports.crearProvemov = async (req, res) => {

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }       
    const { 
            proveid,
            tipofacid,
            nomfacid,
            numfac, 
            fechafac, 
            fechaing,
            gravado,
            iva,
            impuesto,
            total } = req.body;

    try {
      //valido si ya existe el proveedor codigo y nombre
  
      //let buscar = await Proveedor.find({_id: ObjectId(proveid)});
      let buscar = await Proveedor.findById(proveid);

      if (!buscar) {
        return res.status(400).json({ msg: "Proveedor no existe" });
      }
  
      buscar = await Tipofac.findById(tipofacid);
      
      if (!buscar) {
        return res.status(400).json({ msg: "Tipo de factura no existe" });
      } 
      
      buscar = await Nomfac.findById(nomfacid);
      
      if (!buscar) {
        return res.status(400).json({ msg: "Tipo de factura no existe" });
      }

      //console.log(numfac)
      buscar = await Provemov.find({proveid: ObjectId(proveid), numfac: numfac});
      //console.log(buscar)
      if (buscar.length>0) {
        return res.status(400).json({ msg: "Numero de factura con proveedor ya ingresado..." });
      } 
      //creo el nuevo proveedor
      let provemov = new Provemov(req.body);
  
      //guardar proveedor
      await provemov.save();

      return res.json({ msg: "Factura Creada Correctamente." });

  
    } catch (error) {
      res.status(400).send("Hubo un error");
    }
}

// Listar movientos de proveedores
exports.listarprovmov = async (req, res) => {
  try {
      const { pagina, porpagina } = req.query;
      const options = {
          sort : 'fechaing',
          populate : 'proveid tipofacid nomfacid',
          page : parseInt(pagina,10),
          limit : parseInt(porpagina,10),
      }

      let diainicial = req.header('diainicial');
      let diafinal = req.header('diafinal');
      //console.log(diainicial)
      //console.log(diafinal)
      let diaini = diainicial + "T00:00:00.000Z";
      let diafin = diafinal + "T23:59:59.999Z";
      //console.log(diaini)
      //console.log(diafin)
      //todos los movientos de los proveedores
      const provemovdev = await Provemov.paginate({fechaing: { '$gte': diaini, '$lte': diafin} },options);
      //Calculo por nombre de quien compra
      let date_ini = new Date(diaini);
      let date_fin = new Date(diafin);
      const totalescu = await Provemov.aggregate([
        {
          $match: { fechaing: { '$gte': date_ini, '$lte': date_fin }}
        },
        {
        $group:{
                _id:'$nomfacid',
                gravado:{$sum:'$gravado'},
                iva:{$sum: '$iva'},
                impuesto:{$sum: '$impuesto'},
                total:{$sum: '$total'}}
        },
        {
          $lookup:
            {
              from: "nomfacs",
              localField: "_id",
              foreignField: "_id",
              as: "nomfacid"
            }
        },
      ]);
      //calculo gral de compras
      const totalesgral = await Provemov.aggregate([
        {
          $match: { fechaing: { '$gte': date_ini, '$lte': date_fin }}
        },
        {
        $group:{
                _id:'TOTAL GENERAL',
                gravado:{$sum:'$gravado'},
                iva:{$sum: '$iva'},
                impuesto:{$sum: '$impuesto'},
                total:{$sum: '$total'}}
        },
      ]);



    //db.getCollection('provemovs').aggregate([{$match:{fechaing:{ '$gte': ISODate("2021-06-30T00:00:00.000Z"), '$lte': ISODate("2021-06-30T23:59:59.000Z") }}}])

      res.json({ provemovdev, totalescu, totalesgral });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Facturas de Proveedores.' });
  }
}