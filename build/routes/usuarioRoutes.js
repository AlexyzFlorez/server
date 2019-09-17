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
        //Sidebar actividades
        this.router.get('/obtener-numero-eventos', usuarioController_1.usuarioController.obtenerNumeroEventos);
        //Eventos
        this.router.get('/obtener-nombre-actividad/:id', usuarioController_1.usuarioController.obtenerNombreActividad);
        this.router.get('/obtener-eventos/:id', usuarioController_1.usuarioController.obtenerEventos);
        this.router.get('/obtener-detalles-evento/:id', usuarioController_1.usuarioController.obtenerDetallesEvento);
    }
}
const usuarioRoutes = new UsuarioRoutes();
exports.default = usuarioRoutes.router;
