const Productos = require("../models/Productos");
const ImgProducto = require("../models/ImgProducto");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {DBFFile} = require('dbffile');
const path = require('path');
const multer = require('multer');

//actualizar productos en stock
exports.actproductos = async (req,res) =>{
    try {
       //leer la tabla de donde voy a actualizar
       //let dbf = await DBFFile.open('D:/A-SISTEMA/Desktop/Guindi/controllers/stock.DBF');
       let dbf = await DBFFile.open('./subir/stock.DBF');
       //guardo la cantidad de registros que hay
       let totalreg = dbf.recordCount;
       //console.log(`DBF file contains ${dbf.recordCount} records.`);
       //console.log(`Field names: ${dbf.fields.map(f => f.name).join(', ')}`);
       //leo todos los registros
       let records = await dbf.readRecords(totalreg);
       //actualizo la base de datos
       //for (let record of records) console.log(records);
       records.map(p => ingresar(p));

       async function ingresar(p) {           
        // Ver si existe el producto
        let buscarcodi = p.CODI;
        console.log("buscar codi "+buscarcodi)
        const producto = await Productos.findOne({ codi: buscarcodi });
        //const producto = await Productos.find({codi: buscarcodi});
        if(!producto){
            console.log("no lo encuentra ")
            const newproducto = new Productos();
            newproducto.codi = p.CODI;
            newproducto.desc = p.DESC;
            newproducto.stock6 = p.STOCK6;
            newproducto.prpu = p.PRPU;
            newproducto.prcon = p.PRCON;
            p.STOCK6 > 0 ? newproducto.disponible = true : newproducto.disponible = false;
            //newproducto.img = "camino de la imagen";
            await newproducto.save();
        } else{
            console.log("si lo encuentra ")
            producto.desc = p.DESC;
            producto.stock6 = p.STOCK6;
            producto.prpu = p.PRPU;
            producto.prcon = p.PRCON;
            await producto.save();
        }
        }
        res.json({ msg: 'Se actualizaron los Datos. Total de registros: '+totalreg });
       
    } catch (error) {
      console.log(error);
      res.status(500).send("hubo un error")    
    }
  }
//actualizar filedbf
exports.actfiledbf = async (req,res) =>{
    try {
        let storage = multer.diskStorage({ 
            destination: (req, file, cb) => {
                cb(null, '../subirn')
            },
            filename: (req, file, cb) => {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });

        const upload = multer({ storage });
        upload.single('file');

        res.json({ msg: 'Se guardo el archivo ' });
       
    } catch (error) {
      console.log(error);
      res.status(500).send("hubo un error")    
    }
  }
// Listar productos BM
exports.productosbm = async (req, res) => {
    try {
        //const marcas = await Marcas.find({ usuario: req.usuario.id }).sort('marca');
        const { pagina, porpagina } = req.query;
        const options = {
            sort : 'codi',
            populate : 'imgproductoid',
            page : parseInt(pagina,10),
            limit : parseInt(porpagina,10),
        }
        const productos = await Productos.paginate({} ,options);
        res.json({ productos });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Productos.' });
    }
}
//listado de 1 producto con pagination para baja y modificacion
exports.productosbuscarbm = async (req, res) => {
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
            sort : 'codi',
            populate : 'imgproductoid',
            page : parseInt(pagina,10),
            limit : parseInt(porpagina,10),
        }
        const producto = await Productos.paginate({codi: { $eq: codibuscar} } ,options);
        //const producto = await Productos.find({codi: codibuscar});
        if(producto.totalDocs === 0){
            return res.status(404).json({ msg: 'Producto No Encontrado.'});
        }
        console.log(producto);
        res.json({ msg: 'Ok', producto });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de 1 Producto BM.' });
    }
}
// Listar productos tienda mayor
exports.productos = async (req, res) => {
    try {
        //const marcas = await Marcas.find({ usuario: req.usuario.id }).sort('marca');
        const { pagina, porpagina } = req.query;
        const options = {
            sort : 'codi',
            populate : 'imgproductoid',
            page : parseInt(pagina,10),
            limit : parseInt(porpagina,10),
        }
        const productos = await Productos.paginate({disponible: true, stock6: {$gt: 0}},options);
        res.json({ productos });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Productos.' });
    }
}
// Listar destacados
exports.destacados = async (req, res) => {
    try {
        //const marcas = await Marcas.find({ usuario: req.usuario.id }).sort('marca');
        const { pagina, porpagina } = req.query;
        const options = {
            sort : 'codi',
            populate : 'imgproductoid',
            page : parseInt(pagina,10),
            limit : parseInt(porpagina,10),
        }
        const productos = await Productos.paginate({destacado: true, disponible: true, stock6: {$gt: 0}},options);
        res.json({ productos });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Productos.' });
    }
}
// Actualizar Productos
exports.actualizar = async (req, res) => {
    
    // Validación de campos
    //console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("entra error 422")
        return res.status(422).json({ errors: errors.array() });
    }
 
    try {
        // Validar ID
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(404).json({ msg: 'El Producto no existe Mongoose.'});
        }
        let productoaux = new Productos(req.body);
        // Verificar que producto exista
        let producto = await Productos.findById(req.params.id);

        if(!producto){
            return res.status(404).json({ msg: 'El Producto no existe.'});
        }
        //valido el modelo para que no existan 2 en mongoose
        //todos los productos mongoose
        let validoproducto = await Productos.find();
        //inicializo el producto a modificar
        let updateproducto = await Productos.findById(req.params.id);
        const {codi} = updateproducto;
        //filtro el producto que estoy por modificar de todos los q fig en mongoose
        producto = validoproducto.filter(p => p._id != req.params.id);
        //al resultado valido que no exista el codigo para no duplicar
        let encontrado = producto.find(p => p.codi === req.body.codi)
        if(encontrado){
            return res.status(404).json({ msg: 'El Producto ya existe.'});
        }

        // Modificar marca... nota el tercer parametro es para q me devuelva la actualizacion de la marca actualizado
        // Si no lo pongo me devuelve la marca antes de la modificacion 
        // marca = await Marcas.findByIdAndUpdate(req.params.id, req.body, { new: true });

        //esto es para ejecutar el update de la fecha en el modelo de la marca
         if(req.body.codi){
            updateproducto.codi = req.body.codi;
            updateproducto.desc = req.body.desc;
            updateproducto.prpu = req.body.prpu;
            updateproducto.prcon = req.body.prcon;
            updateproducto.disponible = req.body.disponible;
            updateproducto.stock6 = req.body.stock6;
            updateproducto.destacado = req.body.destacado;
            //updateproducto.img = req.body.img;
        }
        await updateproducto.save();
        // Verificar si existe una foto cargada
        if (req.body.img!==""){
            console.log("entra en la seccion de foto" + req.body.imgproductoid)
            if(req.body.imgproductoid === null){
                console.log("entra foto nueva");
                let newimg = new ImgProducto();
                newimg.imgprincipal = req.body.img;
                await newimg.save();
                updateproducto.imgproductoid = newimg._id;
                await updateproducto.save();
                //listo para que devuelva el la imagen con populate
                updateproducto = await Productos.findById(updateproducto._id).populate('imgproductoid');
            } else {
                console.log("entra foto update");
                const imgproducto = await ImgProducto.findById(req.body.imgproductoid);
                if (imgproducto.imgprincipal !== req.body.img){
                    console.log("no son iguales las fotos entra foto update");
                    imgproducto.imgprincipal = req.body.img;
                    await imgproducto.save();
                    //listo para que devuelva el la imagen con populate
                    updateproducto = await Productos.findById(updateproducto._id).populate('imgproductoid');
                }
            }
        } else {
            updateproducto = await Productos.findById(updateproducto._id).populate('imgproductoid');
        }
        res.json({ msg: 'Producto se actualizo correctamente.', updateproducto });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Hubo un error.'});
    }
}
// Eliminar productos
exports.eliminar = async (req, res) => {
    try {
        // Validar ID
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(404).json({ msg: 'El Producto no existe.'});
        }
 
        // Verificar que el producto exista
        let producto = await Productos.findById(req.params.id);
        
        if(!producto){
            return res.status(404).json({ msg: 'El Producto no existe.'});
        }
 
        // Eliminar
        await producto.remove();        
        res.json({msg: 'Producto eliminado correctamente.'});
 
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Hubo un error.'});
    }
};