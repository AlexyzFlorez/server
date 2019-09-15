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
const uuid = require('uuid/v4');
class UsuarioController {
    obtenerNumeroEventos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            let arregloActividades = [];
            try {
                let actividades = yield database_1.default.query(`SELECT * FROM actividad ORDER BY nombre ASC`);
                let todosEventos = yield database_1.default.query(`SELECT * FROM evento`);
                let elementoArreglo = {
                    id: "7c3d4ab1-38e6-4406-87b5-ecee274e3f5b",
                    nombre: "Todos",
                    numero: todosEventos.length
                };
                arregloActividades.push(elementoArreglo);
                for (let i = 0; i < actividades.length; i++) {
                    let eventos = yield database_1.default.query(`SELECT * FROM evento WHERE fk_id_actividad=?`, actividades[i].id_actividad);
                    let numeroEventos = eventos.length;
                    let elementoArreglo = {
                        id: actividades[i].id_actividad,
                        nombre: actividades[i].nombre,
                        numero: numeroEventos
                    };
                    arregloActividades.push(elementoArreglo);
                }
                res.json(arregloActividades);
            }
            catch (e) {
                console.log("Error metodo obtener numero eventos");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.usuarioController = new UsuarioController();
