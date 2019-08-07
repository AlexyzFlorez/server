"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = require("../controllers/usuarioController");
class UsuarioRoutes {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        //Pestaña registro
        this.router.post('/preregistrar-usuario', usuarioController_1.usuarioController.preregistrarUsuario);
        this.router.get('/obtener-departamentos', usuarioController_1.usuarioController.obtenerDepartamentos);
    }
}
const usuarioRoutes = new UsuarioRoutes();
exports.default = usuarioRoutes.router;
