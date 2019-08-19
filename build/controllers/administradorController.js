"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class AdministradorController {
    //Mostrar Titulares
    obtenerUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const usuarios = yield database_1.default.query(`SELECT * FROM usuario`);
                for (let i = 0; i < usuarios.length; i++) {
                    let idDepartamento = usuarios[i].fk_id_departamento;
                    let departamentos = yield database_1.default.query(`SELECT * FROM departamento WHERE id_departamento=?`, idDepartamento);
                    let departamento = departamentos[0].nombre;
                    usuarios[i].nombre_departamento = departamento;
                }
                res.json(usuarios);
            }
            catch (e) {
                console.log("Error metodo obtener usuarios");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    aceptarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idUsuario = req.params.id;
                yield database_1.default.query('UPDATE usuario SET estado_registro=? WHERE id_usuario=?', ["Registrado", idUsuario]);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo aceptar usuario");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    rechazarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idUsuario = req.params.id;
                let usuario = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
                let correo = usuario[0].correo;
                //ENVIAR CORREO ELECTRONICO NOTIFICANDOLE
                yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idUsuario);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo rechazar usuario");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    eliminarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idUsuario = req.params.id;
                let usuario = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
                let correo = usuario[0].correo;
                //ENVIAR CORREO ELECTRONICO NOTIFICANDOLE
                yield database_1.default.query(`DELETE FROM usuario WHERE id_usuario=?`, idUsuario);
                errores.push("Ninguno");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo eliminar usuario");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.administradorController = new AdministradorController();
