 
// Rutas para usuarios
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const usuarioController = require("../controllers/usuarioController");
const productoController = require("../controllers/productoController");
const pedidoController = require("../controllers/pedidoController");
const proveedorController = require("../controllers/proveedorController");
const provemovController = require("../controllers/provemovController");
const tipofacController = require("../controllers/tipofacController");
const nomfacController = require("../controllers/nomfacController");
const beneficiarioController = require("../controllers/beneficiarioController");
const generosController = require('../controllers/generosController');
const estudiosController = require('../controllers/estudiosController');
const programasocialController = require('../controllers/programasocialController');
const actividadesController = require("../controllers/actividadesController");
const origenController = require("../controllers/origenController");
const atencionPublicoController = require("../controllers/atencionPublicoController");
const rubroController = require("../controllers/rubroController");
const experticieController = require("../controllers/experticieController");
const auth = require("../middlewares/auth");
const mongoosePaginate = require("mongoose-paginate-v2");

//es para guardar el archivo upload en una carpeta subir en el servidor
const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({ 
    destination: (req, file, cb) => {
        cb(null, './subir')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname );
    }
});

const upload = multer({ storage });

//act filedbf
router.post('/actfiledbf/',
    auth,
    upload.single('file'), async (req, res) => {
        //console.log(req);
        console.log(req.file);
        console.log('Storage location is ' + req.hostname + ' / ' + req.file.path);
        const {file} = req;
        return res.send({ msg: 'El archivo se subio correctamente.', file });
    }
);
//borrar el archivo stock.dbf
router.get('/removedbf/',
    (req, res) => { 
        var fs = require('fs');
        fs.stat('./subirn', function(err) {
            if (!err) {
                console.log('file or directory exists');
                fs.unlink('./subirn/stock.DBF', (err) => {
                    if (err) throw err;
                    console.log('.subirn/stock.DBF fue deleted');
                });
            }
            else if (err.code === 'ENOENT') {
                console.log('file or directory does not exist');
                fs.mkdir("./subirn", function(err) {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log("New directory successfully created.")
                    }
                })
            }
        });
    }
)
//prueba server
router.get('/prueba/',
    (req, res) => {res.send('Hola Mundo');}
);
//crear usuarios
//api/usuariosAdd
router.post('/usuariosAdd/', 
    [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('documento', 'El documento es obligatorio').notEmpty()
    ], 
    usuarioController.crearUsuarios
);
//api/usuariosEdit
router.put('/usuariosEdit/', 
    [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('documento', 'El documento es obligatorio').notEmpty()
    ], 
    usuarioController.usuariosEdit
);
//api/activeUser
router.put('/activeUser/', 
    [
        check('id', 'El Usuario es obligatorio').notEmpty(),
        check('is_active', 'La condicion es obligatorio').notEmpty()
    ], 
    usuarioController.activeUser
);
// Eliminar User
// api/userdelete/:id
router.delete('/userdelete/:id',
    auth,
    usuarioController.userdelete
);
// Eliminar Atp
// api/atpdelete/:id
router.delete('/atpdelete/:id',
    auth,
    atencionPublicoController.atpdelete
)
// Listar atp por fechas
// api//listatpfecha/
router.get('/listatpfecha/',
    auth,
    [
        check('fechainicial','Fecha inicial es Obligatoria.').notEmpty(),
        check('fechafinal', 'Fecha final es Obligatoria.').notEmpty(),
    ],
    atencionPublicoController.listarAtpFecha
);
//crear beneficiario
//api/beneficiariosAdd 
router.post('/beneficiariosAdd/', 
    [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('apellido', 'El apellido es obligatorio').notEmpty(),
        check('documento', 'El documento es obligatorio').notEmpty(),
        check('provincia', 'La provincia es obligatorio').notEmpty(),
        check('domicilio', 'El domicilio es obligatorio').notEmpty(),
        check('numero', 'El numero es obligatorio').notEmpty(),
        check('genero', 'El genero es obligatorio').notEmpty(),
        check('nrocel1', 'El celumar 1 es obligatorio').notEmpty(),
    ], 
    beneficiarioController.crearBeneficiarios
);
//crear atp
//api/atpAdd 
router.post('/atpAdd/', 
    [
        check('fechainicio', 'La fecha de inicio es obligatorio').notEmpty(),
        check('emprendimientonombre', 'El nombre del emprendimiento es obligatorio').notEmpty(),
        check('idbeneficiario', 'El Beneficiario es obligatorio').notEmpty(),
        //check('origen', 'El origen es obligatorio').notEmpty(),
        //check('actividades', 'La actividad es obligatorio').notEmpty(),
        check('solicita', 'Lo solicitado es obligatorio').notEmpty(),
        //check('marcha', 'Debe ingresar si esta en marcha o no').notEmpty(),
        //check('prioridad', 'La prioridad es obligatorio').notEmpty(),
    ], 
    atencionPublicoController.createAtp
);
//modificar atp
//api/atpModificar/
router.put('/atpModificar/',
    [
        check('fechainicio', 'La fecha de inicio es obligatorio').notEmpty(),
        check('emprendimientonombre', 'El nombre del emprendimiento es obligatorio').notEmpty(),
        //check('idbeneficiario', 'El Beneficiario es obligatorio').notEmpty(),
        check('solicita', 'Lo solicitado es obligatorio').notEmpty(),
    ],
    atencionPublicoController.moodificaAtp
    
);
//api/usuariosEdit
router.put('/beneficiarioEdit/', 
    [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('apellido', 'El apellido es obligatorio').notEmpty(),
        check('documento', 'El documento es obligatorio').notEmpty(),
        check('provincia', 'La provincia es obligatorio').notEmpty(),
        check('domicilio', 'El domicilio es obligatorio').notEmpty(),
        check('numero', 'El numero es obligatorio').notEmpty(),
        check('genero', 'El genero es obligatorio').notEmpty(),
        check('nrocel1', 'El celumar 1 es obligatorio').notEmpty(),
    ], 
    beneficiarioController.beneficiarioEdit
);
// Eliminar Beneficiario
// api/beneficiariodelete/:id
router.delete('/beneficiariodelete/:id',
    auth,
    beneficiarioController.Beneficiariodelete
);

//inciar sesion beneficiariodelete
router.post('/auth', 
[
    check('email', 'Agrega un email valido').isEmail(),
    check('password', 'Paswword minimo 6 caracteres').isLength({min: 6})
],
 usuarioController.autenticarUsuario);
//act productos
router.get('/actproductos',
    auth,
    productoController.actproductos
);
//listado de todos productos con pagination para baja y modificacion
router.get('/productosbm',
    auth,
    productoController.productosbm
);
//listado de 1 producto con pagination para baja y modificacion
router.get('/productosbuscarbm',
    auth,
    [
        check('codibuscar','El Codigo a buscar es Obligatorio.').notEmpty() 
    ],
    productoController.productosbuscarbm
);
//listado de todos productos con pagination
router.get('/productos',
    auth,
    productoController.productos
);
//listados de usuarios
router.get('/users',
    auth,
    usuarioController.users
);
//listado de todos productos con pagination
router.get('/destacados',
    productoController.destacados
);
// api/productos/
router.put('/productos/:id',
    auth,
    [
        check('codi','El Codigo es Obligatorio.').notEmpty(),
        check('desc','La Descripcion es obligatoria.').notEmpty(),
        check('prpu','El precio es obligatorio.').notEmpty(),
        check('prpu','Ingrese un precio válido.').isFloat({min: 1}),
        check('prcon','El precio es obligatorio.').notEmpty(),
        check('prcon','Ingrese un precio válido.').isFloat({min: 1}),
    ],
    productoController.actualizar
);
// Eliminar Poductos
// api/productos/:id
router.delete('/productos/:id',
    auth,
    productoController.eliminar
);
//obtener usuarios
/* router.get('/usuarios',
    auth,
    usuarioController.obtenerUsuarios
) */
//crear pedido
//api/pedido
router.post('/pedido/',
    auth,
    [
        check('idusuario', 'El nombre es obligatorio').notEmpty(),
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('total', 'El importe total es obligatorio').notEmpty(),
        check('cantotal', 'La cantidad total de pedido es obligatorio').notEmpty(),
        check('pedidodetalle', 'El detalle del pedido es obligatorio').notEmpty(),
    ], 
    pedidoController.crearPedido
);
//actualizar pedido
//api/pedido
router.put('/pedido/:id',
    auth,
    [
        check('idusuario', 'El nombre es obligatorio').notEmpty(),
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('total', 'El importe total es obligatorio').notEmpty(),
        check('cantotal', 'La cantidad total de pedido es obligatorio').notEmpty(),
        check('pedidodetalle', 'El detalle del pedido es obligatorio').notEmpty(),
    ], 
    pedidoController.actualizarPedido
);
//prueba
// Listar pedidos por fechas
// api/pedido/
router.get('/pedido/',
    auth,
    [
        check('diainicial','Fecha inicial es Obligatoria.').notEmpty(),
        check('diafinal', 'Fecha final es Obligatoria.').notEmpty(),
    ],
    pedidoController.listarPedidos
);
//crear proveedor
//api/provedor
router.post('/proveedor/',
    auth,
    [
        check('codigo', 'El codigo es obligatorio').notEmpty(),
        check('nombre', 'El nombre es obligatorio').notEmpty(),
    ], 
    proveedorController.crearProveedor
);
//listado de 1 proveedor con pagination para baja
router.get('/proveedorbuscarb',
    auth,
    [
        check('codibuscar','El Nombre a buscar es Obligatorio.').notEmpty() 
    ],
    proveedorController.proveedorbuscarb
);
// Eliminar Proveedor
// api/proveedor/:id
router.delete('/proveedor/:id',
    auth,
    proveedorController.eliminarprov
);
//listado de todos proveedores con pagination
router.get('/listarprov',
    auth,
    proveedorController.listarprov
);
//listado de todos los beneficiarios con pagination
router.get('/listarbeneficiarios',
    auth,
    beneficiarioController.beneficiarios
);
//listado de todos los generos 
router.get('/listargenero',
    auth,
    generosController.genero
);
//listado de todos los estudios 
router.get('/listarestudios',
    auth,
    estudiosController.estudios
);
//listado de todos los actividades 
router.get('/listaractividades',
    auth,
    actividadesController.actividades
);
//listado de todos los origen 
router.get('/listarorigen',
    auth,
    origenController.origen
);
//listado de todos los programas sociales 
router.get('/listarprogramassociales',
    //auth,
    programasocialController.listarprogramassociales
);
//listado de todos los rubros 
router.get('/listarrubros',
    auth,
    rubroController.rubros
);
//listado de experticie 
router.get('/listarexperticie',
    auth,
    experticieController.experticielist
);
//listado de beneficiarios por documento con pagination
router.get('/benebuscardocu',
    //[ auth, authrole.authUser],
    auth,
    [
        check('docubuscar','El Documento a buscar es Obligatorio.').notEmpty() 
    ],
    beneficiarioController.benebuscardocu
);
//listado de atp por id de beneficiario
router.get('/buscaratp',
    //[ auth, authrole.authUser],
    auth,
    [
        check('idbeneficiario','El Beneficiario es Obligatorio.').notEmpty() 
    ],
    atencionPublicoController.buscaratp
);
//listado de beneficiarios por apellido con pagination
router.get('/benebuscarname',
    //[ auth, authrole.authUser],
    auth,
    [
        check('namebuscar','El Apellido a buscar es Obligatorio.').notEmpty() 
    ],
    beneficiarioController.benebuscarname
);
//crear tipo de factura
//api/tipofac
router.post('/tipofac/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').notEmpty()
    ], 
    tipofacController.crearTipofac
);
//listado de todos tipos de facturas con pagination
router.get('/listartipofac/',
    auth,
    tipofacController.listartipofac
);

//crear nombre de factura
//api/nomfac
router.post('/nomfac/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').notEmpty()
    ], 
    nomfacController.crearNomfac
);
//listado de todos nombres de facturas con pagination
router.get('/listarnomfac/',
    auth,
    nomfacController.listarnomfac
);


//crear movimiento de proveedor
//api/provemov
router.post('/provemov/',
    auth,
    [
        check('proveid', 'El proveedor es obligatorio').notEmpty(),
        check('tipofacid', 'Tipo de factura es obligatorio').notEmpty(),
        check('nomfacid', 'El nombre de quien viene la factura es obligatorio').notEmpty(),
        check('numfac', 'El numero de factura es obligatorio').notEmpty(),
        check('fechafac', 'La fecha de la factura es obligatorio').notEmpty(),
        check('fechaing', 'La fecha de ingreso es obligatorio').notEmpty(),
    ], 
    provemovController.crearProvemov
);

// Listar movientos de proveedores por fechas
// api/listarprovmov/
router.get('/listarprovmov/',
    auth,
    [
        check('diainicial','Fecha inicial es Obligatoria.').notEmpty(),
        check('diafinal', 'Fecha final es Obligatoria.').notEmpty(),
    ],
    provemovController.listarprovmov
);
// revalidar usuario
// /auth/user/review/token/
router.get('/auth/user/review/token/',
    auth,
    usuarioController.revalidateToken
);

//dashboard
// /dashboard/main
router.get('/dashboard/main',
    auth,
    beneficiarioController.dashboard
);
// /dashboard/atp/main
router.get('/dashboard/atp/main',
    auth,
    atencionPublicoController.dashboard
);
// /dashboard/beneficiarios/list
router.get('/dashboard/beneficiarios/list',
    auth,
    beneficiarioController.list5benef
);

module.exports = router;