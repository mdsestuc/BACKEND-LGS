const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Leer token del header
    const token = req.header('x-token-data');

    // Si no existe el token
    if(!token){
        return res.status(401).json({ msg: 'No hay token, acceso denegado.'});
    }

    // Validar token
    try {
        const payload = jwt.verify(token, process.env.SECRET);
        req.usuario = payload.usuario;
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'Token no válido, acceso denegado.'});
    }
};