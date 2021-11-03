const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateJWT } = require('../helpers/generate-jwt');
const logger = require('../utils/logger.utils');

const signup = async (req, res = response) => {
    const { name, password } = req.body;
    try {
        let user = await User.findOne({ name });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'El user ya existe'
            });
        }
        //TODO: Esto debería estar en USER CONTROLLER
        user = new User(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();
        // Generar JWT
        const token = await generateJWT(user.id, user.name);
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        logger(`An error has ocurred while authenticating: ${error}`);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const loginUser = async (req, res = response) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró un usuario con ese nickname'
            });
        }
        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const revalidateToken = async (req, res = response) => {
    const { uid, name } = req;
    // Generar JWT
    const token = await generateJWT(uid, name);
    res.json({
        ok: true,
        token
    })
}

module.exports = {
    signup,
    loginUser,
    revalidateToken
}