"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const config = require('../config/config');
class Auth {
    verificarToken(req, res, next) {
        var token = req.query.token;
        jwt.verify(token, config.SEED, (err, decoded) => {
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
        if (usuario.tipo === config.TIPO_EDITOR) {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'No eres editor',
                errors: { mensaje: "No eres editor" }
            });
        }
    }
    verificarEditor(req, res, next) {
        var usuario = req.usuario;
        if (usuario.tipo === config.TIPO_EDITOR || usuario.tipo === config.TIPO_ADMINISTRADOR) {
            next();
            return;
        }
        else {
            return res.status(401).json({
                ok: false,
                mensaje: 'No eres administrador',
                errors: { mensaje: "No eres administardor" }
            });
        }
    }
}
exports.auth = new Auth();
