const jwt = require('jsonwebtoken');
const { response } = require('express')


const validateJWT = (req, res = response, next) => {

    let token = req.header('x-access-token') || req.header('authorization');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }
    try {
        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
        const { password, name } = jwt.verify(
            token,
            process.env.TOKEN_SECRET
        );

        req.password = password;
        req.name = name;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();
}

module.exports = {
    validateJWT
}