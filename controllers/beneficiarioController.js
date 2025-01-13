const Beneficiarios = require("../models/Beneficiarios");
const Generos = require("../models/Generos");
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

exports.crearBeneficiarios = async (req, res) => {
  console.log(req.body, 'beneficiario')
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
      //console.log(req.body.nombre)
      return res.status(400).json({errores: errores.array()})
  } 

  //console.log('para validacion')
    
  const { nombre, 
          apellido, 
          documento, 
          idprovincia,
          provincia,
          iddepartamento,
          departamento,
          idmunicipio,
          municipio,
          idlocalidad,
          localidad,
          domicilio,
          numero,
          piso,
          cp,
          idsexo,
          genero,
          fechanacimiento,
          nrocel1,
          nrocel2, 
          latitud, 
          longitud,
          idestudio,
          estudio,
          jubilacion,
          pension,
          programasocialId } = req.body;

  try {
    let beneficiario = await Beneficiarios.findOne({ documento });
    console.log(beneficiario, 'pasa la busqueda')

    if (beneficiario) {
      return res.status(400).json({ msg: "El documento ya esta registrado" });
    }
    //console.log(beneficiario, 'pasa la validacion')

    let bene = new Beneficiarios(req.body);

    //console.log(bene, 'pasa creacion obj')

    //guardar beneficiario
    await bene.save();
    //console.log(bene, 'pasa add')

    return res.json({ msg: "Beneficiario Creado Correctamente." });

  } catch (error) {
    console.log(error, "error");
    res.status(400).send("Hubo un error");
  }
};

// Eliminar User
exports.Beneficiariodelete = async (req, res) => {
  try {
      // Validar ID
      if(!mongoose.Types.ObjectId.isValid(req.params.id)){
          return res.status(404).json({ msg: 'El Beneficiario no existe.'});
      }

      // Verificar que el Usuario exista
      let benef = await Beneficiarios.findById(req.params.id);
      
      if(!benef){
          return res.status(404).json({ msg: 'El Beneficiario no existe.'});
      }

      // Eliminar
      await benef.remove();        
      res.json({msg: 'Beneficiario eliminado correctamente.'});

  } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Hubo un error.'});
  }
};
// Listar beneficiarios
exports.beneficiarios = async (req, res) => {
  try {
      const { page, limit } = req.query;
      const options = {
          sort : 'nombre',
          populate : ["idsexo", "idestudio", "programasocialId"],
          page : parseInt(page,10),
          limit : parseInt(limit,10),
      }
      const bene = await Beneficiarios.paginate({} ,options);
      //const bene = await Beneficiarios.find().populate("idsexo");
      console.log(bene, "bene")
      res.json({ bene });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Beneficiarios.' });
  }
}
exports.beneficiarioEdit = async (req, res) => {
  console.log("ingresa a beneficiarioEdit")
  console.log(req.body)
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
      console.log(req.body.nombre)
      return res.status(400).json({errores: errores.array()})
  } 
    
  console.log("pasa el error")
  const {             
          id,
          nombre,
          apellido,
          documento,
          idprovincia,
          provincia,
          iddepartamento,
          departamento,
          idmunicipio,
          municipio,
          idlocalidad,
          localidad,
          domicilio,
          numero,
          piso,
          cp,
          idsexo,
          genero,
          fechanacimiento,
          nrocel1,
          nrocel2,
          latitud,
          longitud,
          idestudio,
          estudio,
          jubilacion,
          pension,
          programasocialId
         } = req.body;
  console.log(id, nombre, "id  nombre")
  try {
     //todos los beneficiarios de mongoose
    let todosbene = await Beneficiarios.find();
    //filtro el beneficiario para ver q no se repita el documento
    let resultado = todosbene.filter(bene => bene.id != id );
    console.log(resultado, "resultado")
    let benefic1 = resultado.find(bene => bene.documento == documento );
    console.log(benefic1, "beneficiario")

    if (benefic1) {
      return res.status(400).json({ msg: "El documento ya esta registrado" });
    }

    let updatebene = await Beneficiarios.findById(id);

    updatebene.id = id;
    updatebene.nombre = nombre;
    updatebene.apellido = apellido;
    updatebene.documento = documento;
    updatebene.idprovincia = idprovincia;
    updatebene.provincia = provincia;
    updatebene.iddepartamento = iddepartamento;
    updatebene.departamento = departamento;
    updatebene.idmunicipio = idmunicipio;
    updatebene.municipio = municipio;
    updatebene.idlocalidad = idlocalidad;
    updatebene.localidad = localidad;
    updatebene.domicilio = domicilio;
    updatebene.numero = numero;
    updatebene.piso = piso;
    updatebene.cp = cp;
    updatebene.idsexo = idsexo;
    updatebene.genero = genero;
    updatebene.fechanacimiento = fechanacimiento + "T17:08:36.286Z";
    updatebene.nrocel1 = nrocel1;
    updatebene.nrocel2 = nrocel2;
    updatebene.latitud = latitud;
    updatebene.longitud = longitud;
    updatebene.idestudio = idestudio;
    updatebene.estudio = estudio;
    updatebene.jubilacion = jubilacion;
    updatebene.pension = pension;
    updatebene.programasocialId = programasocialId;
    
    //guardar usuario
    await updatebene.save();
    return res.json({ msg: "Beneficiario se modifico Correctamente." });
  } catch (error) {
    console.log("error");
    res.status(400).send("Hubo un error");
  }
};
exports.benebuscardocu = async (req, res) => {
  console.log(req.header, "req header")
// Validación de campos
const errors = validationResult(req);
if (!errors.isEmpty()) {
    console.log("entra error 422")
    return res.status(422).json({ errors: errors.array() });
}
try {
    const { page, limit } = req.query;
    const docubuscar = req.header('docubuscar');
    console.log("docubuscar "+docubuscar)
    const options = {
        sort : 'documento',
        //populate : 'tirillasid',
        //sort : 'nombre',
        populate : ["idsexo", "idestudio", "programasocialId"],
        page : parseInt(page,10),
        limit : parseInt(limit,10),
    }
    const beneficiario = await Beneficiarios.paginate({documento: { $eq: docubuscar} } ,options);
    //const producto = await Productos.find({codi: codibuscar});
    if(beneficiario.totalDocs === 0){
        return res.status(404).json({ msg: 'Beneficiario No Encontrado.'});
        //return res.json({ msg: 'Beneficiario No Encontrado.'});
    }
    console.log(beneficiario);
    res.json({ msg: 'Ok', beneficiario });
} catch (error) {
    console.log(error);
    return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado 1 Beneficiario.' });
}
}
//listado de beneficiarios por apellido y nombre con pagination
exports.benebuscarname = async (req, res) => {
  // Validación de campos
  console.log(req.body)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      console.log("entra error 422")
      return res.status(422).json({ errors: errors.array() });
  }
  try {
      const { page, limit } = req.query;
      var namebuscar = req.header('namebuscar');
      var name = req.header('name');
      //namebuscar = namebuscar.toUpperCase();
      //name = name.toUpperCase();
      console.log("namebuscar "+namebuscar+ " " +name);
      const options = {
          sort : 'apellido nombre',
          //populate : 'tirillasid',
          populate : ["idsexo", "idestudio", "programasocialId"],
          page : parseInt(page,10),
          limit : parseInt(limit,10),
      }
      const beneficiario = await Beneficiarios.paginate({ apellido: { $regex: namebuscar}, nombre: { $regex: name} } ,options);
      //const beneficiario = await Beneficiarios.paginate({apellido: namebuscar } , options);
      console.log(beneficiario, "beneficiario")
      if(beneficiario.totalDocs === 0){
          return res.status(404).json({ msg: 'Beneficiario No Encontrado.'});
      }
      console.log(beneficiario);
      res.json({ msg: 'Ok', beneficiario });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Busqueda por Nombre y Apellido.' });
  }
}
// datos de dashboard main cantidad de beneficiarios
exports.dashboard = async (req, res) => {
  // Validación de campos
  
  try {
      const benefcant = await Beneficiarios.estimatedDocumentCount();

      console.log(benefcant, "cant de beneficiario")
      if(benefcant.totalDocs === 0){
          return res.status(404).json({ msg: 'Sin Beneficiarios.'});
      }
      console.log(benefcant);
      res.json({ msg: 'Ok', benefcant });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Dashboard.' });
  }
}
// datos de dashboard main lista los 5 ultimos ingreoso de beneficiarios
exports.list5benef = async (req, res) => {
  // Validación de campos
  
  try {
      const benef5list = await Beneficiarios.find().sort({created_at:-1}).limit(5);

      console.log(benef5list, "cant de beneficiario")
      if(benef5list.totalDocs === 0){
          return res.status(404).json({ msg: 'Sin Beneficiarios.'});
      }
      //console.log(benefcant);
      res.json({ msg: 'Ok', benef5list });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Dashboard.' });
  }
}
