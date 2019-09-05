"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const editorController_1 = require("../controllers/editorController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../lib/multer");
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
        this.router.get('/obtener-actividades', editorController_1.editorController.obtenerActividades);
        this.router.get('/obtener-categorias', editorController_1.editorController.obtenerCategorias);
        this.router.get('/obtener-ponentes', editorController_1.editorController.obtenerPonentes);
        this.router.get('/obtener-poblacion', editorController_1.editorController.obtenerPoblacion);
        //Pestaña perfil
        this.router.get('/obtener-perfil/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarEditor], editorController_1.editorController.obtenerPerfil);
        this.router.put('/actualizar-perfil/:id', [auth_1.auth.verificarToken, auth_1.auth.verificarEditor], editorController_1.editorController.actualizarPerfil);
        //Pestaña restablecer password
        this.router.get('/validar-codigo-password/:codigo', editorController_1.editorController.validarCodigoPassword);
        this.router.put('/restablecer-password/:codigo', editorController_1.editorController.restablecerPassword);
        //Registrar evento
        this.router.post('/registrar-evento', [auth_1.auth.verificarToken, auth_1.auth.verificarEditor, multer_1.multerConfig], editorController_1.editorController.registrarEvento);
    }
}
const editorRoutes = new EditorRoutes();
exports.default = editorRoutes.router;
