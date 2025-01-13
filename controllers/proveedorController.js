const Proveedor = require("../models/Proveedor")
const Usuario = require("../models/Usuario");
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

exports.crearProveedor = async (req, res) => {

    const errores = validationResult(req);
    console.log(req.body)
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }       
    const { 
            codigo, 
            nombre, 
            domicilio,
            codpostal,
            provincia,
            observaciones } = req.body;

    try {
      //valido si ya existe el proveedor codigo y nombre
      let provbuscar = await Proveedor.findOne({ codigo });
      if (provbuscar) {
        return res.status(400).json({ msg: "El Codigo de Proveedor ya esta registrado" });
      }

      provbuscar = await Proveedor.findOne({ nombre });
      if (provbuscar) {
        return res.status(400).json({ msg: "El Nommbre de Proveedor ya esta registrado" });
      }
      //creo el nuevo proveedor
      let proveedor = new Proveedor(req.body);
  
      //guardar proveedor
      await proveedor.save();

      return res.json({ msg: "Proveedor Creado Correctamente." });

  
    } catch (error) {
      res.status(400).send("Hubo un error");
    }
}
//listado de 1 producto con pagination para baja
exports.proveedorbuscarb = async (req, res) => {
  // Validación de campos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      console.log("entra error 422")
      return res.status(422).json({ errors: errors.array() });
  }
  try {
      //const marcas = await Marcas.find({ usuario: req.usuario.id }).sort('marca');
      const { pagina, porpagina } = req.query;
      const codibuscar = req.header('codibuscar');
      console.log("codibuscar "+codibuscar)
      const options = {
          sort : 'nombre',
          // populate : 'imgproductoid',
          page : parseInt(pagina,10),
          limit : parseInt(porpagina,10),
      }
      //const proveedor = await Proveedor.paginate({nombre: { $eq: codibuscar} } ,options);
      const proveedor = await Proveedor.paginate({nombre: { $regex: codibuscar} } ,options);

      if(proveedor.totalDocs === 0){
          return res.status(404).json({ msg: 'Proveedor No Encontrado.'});
      }
      console.log(proveedor);
      res.json({ msg: 'Ok', proveedor });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de 1 Proveedor B.' });
  }
}

// Eliminar proveedor
exports.eliminarprov = async (req, res) => {
  try {
      // Validar ID
      if(!mongoose.Types.ObjectId.isValid(req.params.id)){
          return res.status(404).json({ msg: 'El Proveedor no existe.'});
      }

      // Verificar que el proveedor exista
      let proveedor = await Proveedor.findById(req.params.id);
      
      if(!proveedor){
          return res.status(404).json({ msg: 'El Proveedor no existe.'});
      }

      // Eliminar
      await proveedor.remove();        
      res.json({msg: 'Proveedor eliminado correctamente.'});

  } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Hubo un error.'});
  }
};
// Listar Todos los proveedores
exports.listarprov = async (req, res) => {
  try {
      const { pagina, porpagina } = req.query;
      const options = {
          page : parseInt(pagina,10),
          limit : parseInt(porpagina,10),
      }
      //const marcas = await Marcas.find().sort('marca').populate("usuario");
      const proveedores = await Proveedor.paginate({},options);
      //const proveedores = await Proveedor.find({});
      console.log(proveedores)
      res.json({ proveedores });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Proveedores.' });
  }
}

