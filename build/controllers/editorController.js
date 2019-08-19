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
const Usuario_1 = require("../models/Usuario");
const bcyipjs_1 = require("../lib/bcyipjs");
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
const nodemailer_1 = require("../lib/nodemailer");
class EditorController {
    iniciarSesion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let correo = req.body.correo;
                let password = req.body.password;
                const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=?`, correo);
                let estadoUsuario;
                if (correoRegistrados.length > 0) {
                    estadoUsuario = correoRegistrados[0].estado_registro;
                    //Si existe el correo y esta registrado
                    if (estadoUsuario == 'Registrado') {
                        const idUsuario = correoRegistrados[0].id_usuario;
                        const passwords = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
                        const passwordBase = passwords[0].password; //Contraseña de la base de datos
                        if (!bcyipjs_1.bcriptjsConfig.comparar(password, passwordBase)) {
                            errores.push("Password incorrecta");
                            let respuesta = { errores };
                            res.json(respuesta);
                        }
                        else {
                            const tipoUsuarios = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=?`, correo);
                            const tipoUsuario = tipoUsuarios[0].tipo;
                            //Crear TOKEN
                            const usuario = new Usuario_1.Usuario();
                            usuario.id_usuario = idUsuario;
                            usuario.correo = correo;
                            usuario.tipo = tipoUsuario;
                            var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 }); //usuario, clave, 4 horas de expiracion
                            errores.push("Ninguno");
                            res.json({ errores: errores, token: token, usuarioToken: usuario });
                        }
                    }
                    else {
                        errores.push("Usuario no registrado");
                        let respuesta = { errores };
                        res.json(respuesta);
                    }
                }
                else {
                    errores.push("Usuario no registrado");
                    let respuesta = { errores };
                    res.json(respuesta);
                }
            }
            catch (e) {
                console.log("Error metodo iniciar sesion");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    //----------------------------------------------------------------------------------------------
    recuperarPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let correo = req.body.correo;
                let errores = [];
                let banderaCorreo = false;
                const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=?`, correo);
                if (correoRegistrados.length > 0) {
                    banderaCorreo = false;
                }
                else {
                    banderaCorreo = true;
                    errores.push("Correo no registrado");
                }
                if (!banderaCorreo) {
                    const passwordsUsuario = yield database_1.default.query(`SELECT password FROM usuario WHERE correo=?`, correo);
                    const password = passwordsUsuario[0].password;
                    console.log(correo);
                    nodemailer_1.email.enviarCorreo(correo, 'Recuperación de contraseña', `<p>Tu Contraseña es:<strong style="color:red">${password}</strong></p>`);
                    errores.push("Ninguno");
                }
                else {
                    console.log("Correo no registrado");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerDepartamentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const departamentos = yield database_1.default.query(`SELECT nombre FROM departamento`);
                res.json(departamentos);
            }
            catch (e) {
                console.log("Error metodo obtener departamentos");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    preregistrarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let usuario = new Usuario_1.Usuario();
                usuario.id_usuario = uuid();
                usuario.nombre = req.body.nombre;
                usuario.apellido_paterno = req.body.apellido_paterno;
                usuario.apellido_materno = req.body.apellido_materno;
                usuario.telefono = req.body.telefono;
                usuario.num_empleado = req.body.num_empleado;
                usuario.correo = req.body.correo;
                //usuario.password=req.body.password; 
                usuario.password = bcyipjs_1.bcriptjsConfig.encriptar(req.body.password);
                usuario.estado_registro = req.body.estado_registro;
                usuario.tipo = "$2a$10$m3XP./02B3jWnBX1YV.Ua.vWD2LXw/oC81eAjnPaJrqV0ImnD3SxW";
                //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
                const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=?`, usuario.correo);
                if (correoRegistrados.length > 0) {
                    errores.push("Usuario registrado");
                }
                const numEmpleados = yield database_1.default.query(`SELECT num_empleado FROM usuario WHERE num_empleado=?`, usuario.num_empleado);
                if (numEmpleados.length > 0) {
                    errores.push("Num empleado registrado");
                }
                //SI HUBO ERRORES DE CAMPOS REGITRADOS
                if (errores.length > 0) {
                    let respuesta = { errores };
                    console.log("Hay campos invalidos en el servidor");
                    res.json(respuesta);
                }
                else {
                    //INSERTAMOS DATOS---------------------------------------------
                    console.log("No hay errores en la respuesta");
                    const departamento = yield database_1.default.query(`SELECT * FROM departamento WHERE nombre=?`, req.body.departamento);
                    usuario.fk_id_departamento = departamento[0].id_departamento;
                    yield database_1.default.query(`INSERT INTO usuario (id_usuario, nombre, apellido_paterno, apellido_materno, num_empleado, telefono, correo, password, tipo, estado_registro, fk_id_departamento) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [usuario.id_usuario, usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno, usuario.num_empleado, usuario.telefono, usuario.correo, usuario.password, usuario.tipo, usuario.estado_registro, usuario.fk_id_departamento]);
                    //ENVIAMOS RESPUESTA
                    let errores = [];
                    errores.push("Ninguno");
                    let respuesta = { errores };
                    res.json(respuesta);
                }
            }
            catch (e) {
                console.log("Error metodo preregistrar usuario");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerPerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const idUsuario = req.params.id;
                const usuario = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
                if (usuario[0].fk_id_departamento != null) {
                    let departamentos = yield database_1.default.query(`SELECT * FROM departamento WHERE id_departamento=?`, usuario[0].fk_id_departamento);
                    const departamento = departamentos[0].nombre;
                    usuario[0].departamento = departamento;
                }
                res.json(usuario);
            }
            catch (e) {
                console.log("Error metodo obtener perfil");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    actualizarPerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let usuario = new Usuario_1.Usuario();
                const idUsuario = req.params.id;
                const existe = yield database_1.default.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
                if (existe.length > 0) {
                    usuario.nombre = req.body.nombre;
                    usuario.apellido_paterno = req.body.apellido_paterno;
                    usuario.apellido_materno = req.body.apellido_materno;
                    usuario.telefono = req.body.telefono;
                    usuario.num_empleado = req.body.num_empleado;
                    usuario.correo = req.body.correo;
                    usuario.password = bcyipjs_1.bcriptjsConfig.encriptar(req.body.password);
                    usuario.estado_registro = req.body.estado_registro;
                    const departamento = yield database_1.default.query(`SELECT * FROM departamento WHERE nombre=?`, req.body.departamento);
                    usuario.fk_id_departamento = departamento[0].id_departamento;
                    //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
                    const correoRegistrados = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=? AND id_usuario!=?`, [usuario.correo, idUsuario]);
                    if (correoRegistrados.length > 0) {
                        errores.push("Usuario registrado");
                    }
                    const numEmpleados = yield database_1.default.query(`SELECT num_empleado FROM usuario WHERE num_empleado=? AND id_usuario!=?`, [usuario.num_empleado, idUsuario]);
                    if (numEmpleados.length > 0) {
                        errores.push("Num empleado registrado");
                    }
                    //SI HUBO ERRORES DE CAMPOS REGITRADOS
                    if (errores.length > 0) {
                        console.log("Hay campos invalidos en el servidor");
                    }
                    else {
                        //INSERTAMOS DATOS---------------------------------------------
                        console.log("No hay errores en la respuesta");
                        yield database_1.default.query('UPDATE usuario SET nombre=?, apellido_paterno=?, apellido_materno=?, telefono=?, num_empleado=?, fk_id_departamento=?, correo=?, password=? WHERE id_usuario=?', [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno, usuario.telefono, usuario.num_empleado, usuario.fk_id_departamento, usuario.correo, usuario.password, idUsuario]);
                        errores.push("Ninguno");
                    }
                }
                else {
                    errores.push("No existe");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo actualizar alumno");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.editorController = new EditorController();
