"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
class Auth {
    verificarToken(req, res, next) {
        var token = req.query.token;
        jwt.verify(token, SEED, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Token incorrecto',
                    errors: err
                });
            }
            //Para tener la informacion del usuario en el request
            req.usuario = decoded.usuario;
            next();
        });
    }
    verificarAdministrador(req, res, next) {
        var usuario = req.usuario;
        if (usuario.tipo === "Administrador") {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error 1',
                errors: { mensaje: "Error 1" }
            });
        }
    }
    verificarUsuario(req, res, next) {
        var usuario = req.usuario;
        if (usuario.tipo === "Normal") {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error 2',
                errors: { mensaje: "Error 2" }
            });
        }
    }
}
exports.auth = new Auth();
