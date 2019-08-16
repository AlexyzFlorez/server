"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const administradorController_1 = require("../controllers/administradorController");
const auth_1 = require("../middleware/auth");
class AdministradorRoutes {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/obtener-usuarios', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.obtenerUsuarios);
        this.router.put('/aceptar-usuario/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.aceptarUsuario);
        this.router.delete('/rechazar-usuario/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.rechazarUsuario);
        this.router.delete('/eliminar-usuario/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarAdministrador], administradorController_1.administradorController.eliminarUsuario);
    }
}
const administradorRoutes = new AdministradorRoutes();
exports.default = administradorRoutes.router;
