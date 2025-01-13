const Usuario = require("../models/Usuario");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.crearUsuarios = async (req, res) => {
  console.log(req.nombre)
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
      console.log(req.nombre)
      return res.status(400).json({errores: errores.array()})
  } 
    
  const { nombre, apellido, email, password, documento, changepassword, rol, is_active } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msg: "El email ya esta registrado" });
    }

    usuario = new Usuario(req.body);

    //has password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    //guardar usuario
    await usuario.save();

    return res.json({ msg: "Usuario Creado Correctamente." });

    //crear y firmar jwt
/*     const payload = {
        usuario:{
            id: usuario.id
        }

    };
    jwt.sign(payload, process.env.SECRET,{
        expiresIn: 360000 //100 horas
    }, (error,token) => {
        if (error) throw error;
        res.json({token})
    }) */

  } catch (error) {
    console.log("error");
    res.status(400).send("Hubo un error");
  }
};

exports.usuariosEdit = async (req, res) => {
  console.log("ingresa a usuarioEdit")
  console.log(req.body)
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
      console.log(req.body.nombre)
      return res.status(400).json({errores: errores.array()})
  } 
    
  console.log("pasa el error")
  const { id, nombre, apellido, email, password, documento, changepassword, rol, is_active } = req.body;
  console.log(id, nombre, "id  nombre")
  try {
     //todos los usuarios de mongoose
    let todosuser = await Usuario.find();
    //filtro el usuario para ver q no se repita el mail
    let resultado = todosuser.filter(user => user.id != id );
    console.log(resultado, "resultado")
    let usuario = resultado.find(user => user.email == email );
    console.log(usuario, "usuario")

    if (usuario) {
      return res.status(400).json({ msg: "El email ya esta registrado" });
    }

    let updateusuario = await Usuario.findById(id);
    updateusuario.nombre = nombre;
    updateusuario.apellido = apellido;
    updateusuario.email = email;
    updateusuario.documento = documento;
    updateusuario.rol = rol;
    
    //guardar usuario
    await updateusuario.save();
    return res.json({ msg: "Usuario se modifico Correctamente." });
  } catch (error) {
    console.log("error");
    res.status(400).send("Hubo un error");
  }
};

exports.activeUser = async (req, res) => {
  console.log("ingresa a usuarioActive")
  console.log(req.body)
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
      console.log(req.body)
      return res.status(400).json({errores: errores.array()})
  } 
    
  const { id, is_active } = req.body;
  console.log(id, is_active, "id  activo")
  try {
    let updateusuario = await Usuario.findById(id);
    console.log(updateusuario, "usuario encontrado")

    if (updateusuario === null) {
      return res.status(400).json({ msg: "El usuario no Existe" });
    }

    //let updateusuario = await Usuario.findById(id);
    updateusuario.is_active = !is_active;
    //guardar usuario
    await updateusuario.save();
    return res.json({ msg: "Usuario se modifico Correctamente." });
  } catch (error) {
    console.log("error");
    res.status(400).send("Hubo un error");
  }
};

// Eliminar User
exports.userdelete = async (req, res) => {
  try {
      // Validar ID
      if(!mongoose.Types.ObjectId.isValid(req.params.id)){
          return res.status(404).json({ msg: 'El Usuario no existe.'});
      }

      // Verificar que el Usuario exista
      let usuario = await Usuario.findById(req.params.id);
      
      if(!usuario){
          return res.status(404).json({ msg: 'El Usuario no existe.'});
      }

      // Eliminar
      await usuario.remove();        
      res.json({msg: 'Usuario eliminado correctamente.'});

  } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Hubo un error.'});
  }
};

exports.autenticarUsuario = async (req, res) => {
  console.log('ingresa01')
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email } , { _id: 1, nombre: 1, rol: 1, password: 1 });

    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ msg: "Usuario o Password incorrecto" });
    }

   console.log(usuario, 'usuario encontrado login')
   console.log(usuario._id, 'valor _id')
   console.log(usuario.id, 'valor id')

   //crear y firmar jwt
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
    //solo envio datos del user
    usuario.password ="";
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 360000, //100 hora
      },
      (error, token) => {
        if (error) throw error;
        console.log('ingresa');
        res.json({ token, usuario });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};
// Listar usuarios
exports.users = async (req, res) => {
  try {
      const { page, limit } = req.query;
      const options = {
          sort : 'nombre',
          //populate : 'imgproductoid',
          page : parseInt(page,10),
          limit : parseInt(limit,10),
      }
      const users = await Usuario.paginate({} ,options);
      res.json({ users });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Usuarios.' });
  }
}
// revalida ingreso de usuario
exports.revalidateToken = async (req, res) => {
  console.log(req.usuario, 'user req')
  const { id } = req.usuario;
  try {
  //let usuario = await Usuario.findOne({ email } , { _id: 1, nombre: 1, rol: 1, password: 1 });
  let usuario = await Usuario.findById(id);
  //const { _id, nombre, rol, password } = usuario;
  console.log(usuario, 'datos usuario encontrado review');

    //crear y firmar jwt
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
    console.log(process.env.SECRET, 'secret')
    //solo envio datos del user
    usuario.password ="";
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 360000, //100 hora
      },
      (error, token) => {
        if (error) throw error;
        console.log( {token, usuario}, 'ingresa token y usuario')
        console.log(usuario.id, 'usuario.id ')
        res.json({ token, usuario });
        //res.json('ok');
      }
     );
    //res.json({ usuario });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Usuarios.' });
}
  // const token = await generarJWT({ _id, nombre, rol, password });

  // response.status(200).json({
  //   status: 'success',
  //   msg: 'Token generado correctamente!',
  //   res: {
  //     id: _id,
  //     firstname,
  //     lastname,
  //     role,
  //     token,
  //   },
  // });
};
