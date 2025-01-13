const Pedido = require("../models/Pedido");
const Usuario = require("../models/Usuario");
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.crearPedido = async (req, res) => {

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      //console.log(req.body.detallepedido)
        return res.status(400).json({errores: errores.array()})
    }       
    const { idusuario, 
            nombre, 
            cantotal,
            total,
            observaciones,
            pedidodetalle } = req.body;
  
    try {
      let usuario = await Usuario.findById(idusuario);
      if (!usuario) {
        return res.status(400).json({ msg: "Usuario invalido." });
      }

      let pedido = new Pedido(req.body);
  
      //guardar pedido
      await pedido.save();

      //enviar email
      var nodemailer = require('nodemailer');

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'arielm1000@gmail.com',
          pass: 'vugljnpxmeyjadtd'
        }
      });
      //el detalle del pedido
      var detped = '';
      pedidodetalle.forEach(function(produ) {
        detped = detped + '\n' + produ.codi+ "\t\t"+ produ.desc + "\t\t" + produ.cant + "\t\t" + produ.prcon;
      });
      console.log(detped);
      var mailOptions = {
        from: 'arielm1000@gmail.com',
        to: 'arielm1000@yahoo.com.ar, gabycordoba2704@gmail.com, gasguini@gmail.com',
        subject: 'Ingreso de Nuevo Pedido de Prueba',
        text: 'Pedido de: '+ nombre + ' cantidad de productos: ' + cantotal + ' Monto total: ' + total + '\nObservaciones: ' + observaciones + detped
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
  
      return res.json({ msg: "Pedido Creado Correctamente." });

  
    } catch (error) {
      res.status(400).send("Hubo un error");
    }
};
// Listar pedidos
exports.listarPedidos = async (req, res) => {
  try {
      //const marcas = await Marcas.find({ usuario: req.usuario.id }).sort('marca');
      const { pagina, porpagina } = req.query;
      const options = {
          sort : 'created_at',
          //populate : 'usuario',
          page : parseInt(pagina,10),
          limit : parseInt(porpagina,10),
      }
      let diainicial = req.header('diainicial');
      let diafinal = req.header('diafinal') + ' 23:59:00';
      
      const pedidos = await Pedido.paginate({created_at: { '$gte': diainicial, '$lte': diafinal} },options);
      res.json({ pedidos });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Pedidos.' });
  }
}
// Actualizar Pedido impresion
exports.actualizarPedido = async (req, res) => {
    
  // Validación de campos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

  try {
      // Validar ID
      if(!mongoose.Types.ObjectId.isValid(req.params.id)){
          return res.status(404).json({ msg: 'El Pedido no existe Mongoose.'});
      }
      //Busco pedido en mongoose
      let pedido = await Pedido.findById(req.params.id);

      if(!pedido){
          return res.status(404).json({ msg: 'El Pedido no existe.'});
      }

      // Modificar marca... nota el tercer parametro es para q me devuelva la actualizacion de la marca actualizado
      // Si no lo pongo me devuelve la marca antes de la modificacion 
      // marca = await Marcas.findByIdAndUpdate(req.params.id, req.body, { new: true });

      //esto es para ejecutar el update de la fecha en el modelo del pedido
      if(req.body.idusuario){
        //solo modifico la impresion
        pedido.impreso = req.body.impreso;
      }
      await pedido.save();
      res.json({ msg: 'El Pedido se actualizo correctamente.', pedido });
  } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Hubo un error.'});
  }
}