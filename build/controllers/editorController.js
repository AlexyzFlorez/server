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
const VariablesGlobales_1 = require("../models/VariablesGlobales");
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
    validarCodigoPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let codigo = req.params.codigo;
                const codigos = yield database_1.default.query(`SELECT * FROM usuario WHERE codigo_res_password=?`, codigo);
                if (codigos.length > 0) {
                    errores.push("Ninguno");
                }
                else {
                    errores.push("Codigo incorrecto");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo validar codigo");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
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
                    const usuario = yield database_1.default.query(`SELECT * FROM usuario WHERE correo=?`, correo);
                    const codigo = usuario[0].codigo_res_password;
                    nodemailer_1.email.enviarCorreo(correo, 'Restablecimiento de contraseña', `
        <div style='width:30vw; padding:50px; display:block; border:1px solid #16B4FC; text-align:center; margin:0 auto'>
          <p style='width:100%; color:#53575A'>Haz solicitado el restablecimiento de tu contraseña en SisEvent</p>
          <a href='${VariablesGlobales_1.VariablesGlobales.dominio}/restablecer-password/${codigo}' style='text-decoration:none; background:#16B4FC; color:#fff; border-radius:20px;padding:10px; font-size:14px; width:100%; display:block; text-align:center; margin:0 auto'>Restablecer contraseña</a>
        </div>`);
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
    restablecerPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                let password = req.body.password;
                let codigo = req.body.codigo_res_password;
                const codigos = yield database_1.default.query(`SELECT * FROM usuario WHERE codigo_res_password=?`, codigo);
                if (codigos.length < 1) {
                    errores.push("Codigo incorrecto");
                }
                else {
                    let nuevaPassword = bcyipjs_1.bcriptjsConfig.encriptar(password);
                    let nuevoCodigo = uuid();
                    yield database_1.default.query('UPDATE usuario SET password=?, codigo_res_password=? WHERE codigo_res_password=?', [nuevaPassword, nuevoCodigo, codigo]);
                    errores.push("Ninguno");
                }
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error metodo restablecer codigo");
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
    obtenerActividades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const actividades = yield database_1.default.query(`SELECT nombre FROM actividad`);
                res.json(actividades);
            }
            catch (e) {
                console.log("Error metodo obtener actividades");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerCategorias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const categorias = yield database_1.default.query(`SELECT nombre FROM categoria`);
                res.json(categorias);
            }
            catch (e) {
                console.log("Error metodo obtener categorias");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerPonentes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const ponentes = yield database_1.default.query(`SELECT tipo FROM ponentes`);
                res.json(ponentes);
            }
            catch (e) {
                console.log("Error metodo obtener ponentes");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    obtenerPoblacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                const poblacion = yield database_1.default.query(`SELECT tipo FROM poblacion`);
                res.json(poblacion);
            }
            catch (e) {
                console.log("Error metodo obtener poblacion");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
    registrarEvento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let errores = [];
            try {
                //console.log(req
                console.log(req.body);
                console.log(req.file.filename);
                let id_usuario = req.body.id_usuario;
                let nombre = req.body.nombre;
                let departamento = req.body.departamento;
                let costo = req.body.costo;
                let tipo_actividad = req.body.tipo_actividad;
                let nombre_actividad = req.body.nombre_actividad;
                let categoria = req.body.categoria;
                let fecha_inicio = req.body.fecha_inicio;
                let fecha_termino = req.body.fecha_termino;
                let hora_inicio = req.body.hora_inicio;
                let descripcion = req.body.descripcion;
                let ponentes = req.body.ponentes;
                let poblacion = req.body.poblacion;
                let url_portada = req.file.filename;
                if (tipo_actividad === "Otro") {
                    // await db.query(`INSERT INTO actividad (nombre) VALUES (?)`, [nombre_actividad]);
                    yield database_1.default.query(`INSERT INTO evento (costo) VALUES (?)`, [costo]);
                    tipo_actividad = nombre_actividad;
                }
                let id_evento = uuid();
                let idsDepartamento = yield database_1.default.query(`SELECT * FROM departamento WHERE nombre=?`, departamento);
                let idDepartamento = idsDepartamento[0].id_departamento;
                let idsCategoria = yield database_1.default.query(`SELECT * FROM categoria WHERE nombre=?`, categoria);
                let idCategoria = idsCategoria[0].id_categoria;
                let idsActividad = yield database_1.default.query(`SELECT * FROM actividad WHERE nombre=?`, tipo_actividad);
                let idActividad = idsActividad[0].id_actividad;
                let idsPonentes = yield database_1.default.query(`SELECT * FROM ponentes WHERE tipo=?`, ponentes);
                let idPonentes = idsPonentes[0].id_ponentes;
                let idsPoblacion = yield database_1.default.query(`SELECT * FROM poblacion WHERE tipo=?`, poblacion);
                let idPoblacion = idsActividad[0].id_poblacion;
                yield database_1.default.query(`INSERT INTO evento (id_evento, nombre, costo, descripcion, url_portada, en_memeoria, fk_id_usuario, fecha_inicio, fecha_termino, hora_inicio, hora_termino, fk_id_departamento, fk_id_actividad, fk_id_categoria, fk_id_ponentes, fk_id_poblacion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [costo]);
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
            catch (e) {
                console.log("Error Metodo registrar evento");
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
                usuario.codigo_res_password = uuid();
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
                    yield database_1.default.query(`INSERT INTO usuario (id_usuario, nombre, apellido_paterno, apellido_materno, num_empleado, telefono, correo, password, tipo, estado_registro, fk_id_departamento, codigo_res_password) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, [usuario.id_usuario, usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno, usuario.num_empleado, usuario.telefono, usuario.correo, usuario.password, usuario.tipo, usuario.estado_registro, usuario.fk_id_departamento, usuario.codigo_res_password]);
                    const correosAdministrador = yield database_1.default.query(`SELECT correo FROM usuario WHERE tipo=?`, "$2a$10$kAuF.n3BG7N8rXpqKnGziOkk8jplw4DWVdkUshhsc3Bvt8YVx2Yom");
                    const correoAdministrador = correosAdministrador[0].correo;
                    nodemailer_1.email.enviarCorreo(correoAdministrador, 'Solicitud de registro', `<p>Hay una nueva solicitud de registro al sistema SisEvent</p>`);
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
