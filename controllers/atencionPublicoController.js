const Atencionatp = require("../models/Atencionapt");
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');
const path = require("path");

exports.createAtp = async (req, res) => {
    console.log(req.body, 'atp')
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        //console.log(req.body.nombre)
        return res.status(400).json({errores: errores.array()})
    }
    console.log('pasa la validacion')

    const { 
        idbeneficiario,
        fechainicio, 
        emprendimientonombre,
        origen,
        //origenName,
        solicita, 
        observaciones,
        marcha,        
        actividades,
        experticie,
        prioridad } = req.body;

  //console.log(origen, origenName,"origen y origenname")
  let fechahoy = new Date();;
  console.log(fechahoy, "fecha hoy")
  let Atprec = {
    idbeneficiario: idbeneficiario,
    fechainicio: fechainicio + "T17:08:36.286Z",
    emprendimientonombre: emprendimientonombre,
    origen: origen,
    solicita: solicita,
    observaciones: observaciones,
    marcha: marcha,
    actividades: actividades,
    idexperticie: experticie,
    prioridad: prioridad,
    visitas: [],
    fechaatp: fechahoy,
}
    

try {
  //let beneficiario = await Beneficiarios.findOne({ documento });
  //console.log(beneficiario, 'pasa la busqueda')

  //if (beneficiario) {
  //  return res.status(400).json({ msg: "El documento ya esta registrado" });
  //}
  console.log(Atprec,'pasa la validacion atprec')

/*   let newAtp = new Atencionatp({idbeneficiario,
    fechainicio, 
    emprendimientonombre,
    //origen,
    solicita, 
    observaciones,
    marcha,        
    //actividades,
    prioridad }); */
    //let newAtp = new Atencionatp(req.body);
    let newAtp = new Atencionatp(Atprec);

    console.log(newAtp, 'pasa la validacion3')

  //console.log(bene, 'pasa creacion obj')

  //guardar Atp
  await newAtp.save();
  //console.log(bene, 'pasa add')
  console.log('pasa la validacion4')

  return res.json({ msg: "ATP del Beneficiario Creado Correctamente." });

} catch (error) {
  //console.log(error, "error");
  res.status(400).send("Hubo un error");
}
}
exports.buscaratp = async (req, res) => {
  console.log(req.header, "req header")
// Validación de campos
const errors = validationResult(req);
if (!errors.isEmpty()) {
    console.log("entra error 422")
    return res.status(422).json({ errors: errors.array() });
}
try {
    const { page, limit } = req.query;
    const idbeneficiario = req.header('idbeneficiario');
    console.log("idbeneficiario "+idbeneficiario)
    const options = {
        sort : 'idbeneficiario',
        //populate : 'tirillasid',
        //sort : 'nombre',
        populate : [ "origen", "actividades"],
        page : parseInt(page,10),
        limit : parseInt(limit,10),
    }
    const atp = await Atencionatp.paginate({idbeneficiario: { $eq: idbeneficiario} } ,options);
    //const producto = await Productos.find({codi: codibuscar});
    if(atp.totalDocs === 0){
        return res.status(404).json({ msg: 'Atp del Beneficiario No Encontrado.'});
        //return res.json({ msg: 'Beneficiario No Encontrado.'});
    }
    console.log(atp);
    res.json({ msg: 'Ok', atp });
} catch (error) {
    console.log(error);
    return res.status(400).json({ msg: 'Hubo un error en el Servidor, busqueda ATP.' });
}
}
exports.moodificaAtp = async (req, res) => {
  console.log("ingresa a moodificaAtp")
  console.log(req.body)
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
      console.log(req.body.fechainicio)
      return res.status(400).json({errores: errores.array()})
  } 
    
  console.log("pasa el error")
  const {       
          atpid,
          fechainicio,
          emprendimientonombre,
          origen,
          solicita,
          observaciones,
          marcha,
          actividades,
          prioridad,
          experticie,
          fechaatp,
          visitas
         } = req.body;
  console.log(atpid, fechainicio, "id  atp")
  try {
    let updateatp = await Atencionatp.findById(atpid);

    updateatp.fechainicio = fechainicio + "T17:08:36.286Z",
    updateatp.emprendimientonombre = emprendimientonombre,
    updateatp.origen = origen,
    updateatp.solicita = solicita,
    updateatp.observaciones = observaciones,
    updateatp.marcha = marcha,
    updateatp.actividades = actividades,
    updateatp.prioridad = prioridad,
    updateatp.idexperticie = experticie,
    updateatp.fechaatp = fechaatp,
    updateatp.visitas = visitas,
    
    //guardar usuario
    await updateatp.save();
    return res.json({ msg: "Atp se modifico Correctamente." });
  } catch (error) {
    console.log("error");
    res.status(400).send("Hubo un error");
  }
};
// Eliminar atp
exports.atpdelete = async (req, res) => {
  console.log(req.params, 'req.params')
  try 
  { 
    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(404).json({ msg: 'No existe Atp'})
    }
    // verificar que atp exista
    let atp = await Atencionatp.findById(req.params.id);

    if (!atp){
      return res.status(404).json({ msg: 'La atp no existe'})
    }
    // Eliminar
    await atp.remove();
    res.json({ msg: 'Atp elininada correctamente'})
  
  } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Hubo un error.'});
  }
};

// Listar atp entre 2 fechas
exports.listarAtpFecha = async (req, res) => {
  try {
      
      const { pagina, porpagina } = req.query;
      console.log(req.header('fechainicial'), "fecha i")
      console.log(req.header('fechafinal'), "fecha f")
      const options = {
          sort : 'fechaatp',
          //populate : 'usuario',
          page : parseInt(pagina,10),
          limit : parseInt(porpagina,10),
      }
      let fechainicial = req.header('fechainicial');
      let fechafinal = req.header('fechafinal')+ ' 23:59:00';
      //let fechafinal = "2024-09-20T00:00:00.000Z";
      
      //const atp = await Atencionatp.paginate({fechaatp: { $gte: fechainicial, $lte: fechafinal} },options);
      //. populate({path: 'friends', populate: { path: 'friends' }  })
      const atp = await Atencionatp.find({fechaatp: {$gte: fechainicial, $lt: fechafinal}}).populate({ path: 'idbeneficiario',populate: [ 'idsexo', 'idestudio' , 'programasocialId' ] }).populate('actividades').populate('idexperticie').populate('origen').sort({ fechaatp: 1 });;
      console.log(atp, "atp")
      res.json({ atp });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Pedidos.' });
  }
}

// datos de dashboard atp main
exports.dashboard = async (req, res) => {
  // Validación de campos
  
  try {
      const atpcant = await Atencionatp.estimatedDocumentCount();

      console.log(atpcant, "cant de atp")
      if(atpcant.totalDocs === 0){
          return res.status(404).json({ msg: 'Sin atp.'});
      }
      console.log(atpcant);
      res.json({ msg: 'Ok', atpcant });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Dashboard.' });
  }
}

