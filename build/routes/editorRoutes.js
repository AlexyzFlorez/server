"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const editorController_1 = require("../controllers/editorController");
const auth_1 = require("../middleware/auth");
class EditorRoutes {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        //Pestaña iniciar sesion
        this.router.post('/iniciar-sesion', editorController_1.editorController.iniciarSesion);
        this.router.post('/recuperar-password', editorController_1.editorController.recuperarPassword);
        //Pestaña registro
        this.router.post('/preregistrar-usuario', editorController_1.editorController.preregistrarUsuario);
        this.router.get('/obtener-departamentos', editorController_1.editorController.obtenerDepartamentos);
        //Pestaña perfil
        this.router.get('/obtener-perfil/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarEditor], editorController_1.editorController.obtenerPerfil);
        this.router.put('/actualizar-perfil/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarEditor], editorController_1.editorController.actualizarPerfil);
    }
}
const editorRoutes = new EditorRoutes();
exports.default = editorRoutes.router;
