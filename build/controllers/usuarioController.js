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
class UsuarioController {
    obtenerDepartamentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Obteniendo departamentos");
            let errores = [];
            try {
                const departamentos = yield database_1.default.query(`SELECT nombre FROM departamento`);
                console.log(departamentos);
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
            console.log("Entra");
            let errores = [];
            try {
                console.log(req.body);
                /*
                let usuario=new Usuario();
                usuario.nombre=req.body.nombre;
                usuario.apellido_paterno=req.body.apellido_paterno;
                usuario.apellido_materno=req.body.apellido_materno;
                usuario.telefono=req.body.telefono;
                usuario.departamento=req.body.departamento;
                usuario.correo=req.body.correo;
                usuario.password=bcriptjsConfig.encriptar(req.body.password);
                usuario.estado_registro=req.body.estado_registro;
            
                //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
                const correoRegistrados=await db.query(`SELECT * FROM usuario WHERE correo=?`,usuario.correo);
                
                if(correoRegistrados.length>0)
                {
                    const estadoUsuario=correoRegistrados[0].estado_registro;
                    const idUsuario=correoRegistrados[0].id_usuario;
                    
                    const idsTipo=await db.query(`SELECT * FROM tipo_usuario WHERE fk_id_usuario=?`,idUsuario);
                    const idTipo=idsTipo[0].fk_id_tipo;
        
                    const nombresTipo=await db.query(`SELECT * FROM tipo WHERE id_tipo=?`,idTipo);
                    const nombreTipo=nombresTipo[0].tipo;
        
                    if(estadoUsuario==='Registrado')
                    {
                    errores.push("Usuario registrado");
                    }
                    
                    if(nombreTipo!=usuario.tipo)
                    {
                    errores.push("Tipo distinto");
                    }
                }
                else
                {
                    errores.push("Correo no preregistrado");
                }
              
                 
              //VALIDAMOS los campos que no deben estar registrados para cada usuario
              if(usuario.tipo==='Titular' || usuario.tipo==='Docente' || usuario.tipo==='Deysa' || usuario.tipo==='Administrador')
              {
                  const numEmpleados=await db.query(`SELECT num_empleado FROM docente WHERE num_empleado=?`,usuario.num_empleado);
                
                  if(numEmpleados.length>0)
                  {
                    errores.push("Num empleado registrado");
                  }
      
                  const numEmpleados2=await db.query(`SELECT num_empleado FROM deysa WHERE num_empleado=?`,usuario.num_empleado);
                
                  if(numEmpleados2.length>0)
                  {
                    errores.push("Num empleado registrado");
                  }
      
                  const numEmpleados3=await db.query(`SELECT num_empleado FROM administrador WHERE num_empleado=?`,usuario.num_empleado);
                
                  if(numEmpleados3.length>0)
                  {
                    errores.push("Num empleado registrado");
                  }
              }
              else if(usuario.tipo==='Alumno')
              {
                const boleta=await db.query(`SELECT boleta FROM alumno WHERE boleta=?`,usuario.boleta);
              
                if(boleta.length>0)
                {
                  errores.push("Boleta registrada");
                }
              }
      
              //SI HUBO ERRORES DE CAMPOS REGITRADOS
              if(errores.length>0)
              {
                let respuesta:any={errores}
                console.log("Hay campos invalidos en el servidor")
      
                if(usuario.tipo==='Titular' || usuario.tipo==='Docente')
                {
                  fSystem.eliminarArchivo(usuario.url_curriculum);
                }
                res.json(respuesta)
              }
              else
              {
                //INSERTAMOS DATOS---------------------------------------------
                console.log("No hay errores en la respuesta")
      
                let idsUsuarios;
                let idUsuario;
                if(usuario.tipo=="Administrador")
                {
                }
                else
                {
                  idsUsuarios=await db.query(`SELECT id_usuario FROM usuario WHERE correo=?`,usuario.correo);
                  idUsuario=idsUsuarios[0].id_usuario;
                }
                
                await db.query('UPDATE usuario SET nombre=?, apellido_paterno=?, apellido_materno=?, password=?, estado_registro=? WHERE correo=?',[usuario.nombre,usuario.apellido_paterno,usuario.apellido_materno,usuario.password,usuario.estado_registro,usuario.correo]);
                
                if(usuario.tipo==='Titular' || usuario.tipo==='Docente')
                {
                  const idsAcademias=await db.query(`SELECT id_academia FROM academia WHERE nombre=?`,usuario.academia);
                  const idAcademia=idsAcademias[0].id_academia;
              
                  await db.query('UPDATE docente SET num_empleado=?,fk_id_academia=?, url_curriculum=? WHERE fk_id_usuario=?',[usuario.num_empleado,idAcademia,usuario.url_curriculum,idUsuario]);
                }
                else if(usuario.tipo==='Deysa')
                {
                  await db.query('UPDATE deysa SET num_empleado=? WHERE fk_id_usuario=?',[usuario.num_empleado,idUsuario]);
                }
                else if(usuario.tipo==='Administrador')
                {
                 
                  idUsuario=uuid();
                  await db.query(`INSERT INTO usuario (id_usuario,correo,nombre,apellido_paterno,apellido_materno,password,estado_registro) VALUES (?,?,?,?,?,?,?)`,[idUsuario,usuario.correo,usuario.nombre,usuario.apellido_paterno,usuario.apellido_materno,usuario.password,usuario.estado_registro]);
                  await db.query(`INSERT INTO tipo_usuario (fk_id_usuario,fk_id_tipo) VALUES (?,?)`,[idUsuario,1]);
                  await db.query(`INSERT INTO administrador (fk_id_usuario,num_empleado) VALUES (?,?)`,[idUsuario,usuario.num_empleado]);
                }
                else if(usuario.tipo==='Alumno')
                {
                  const idsCarreras=await db.query(`SELECT id_carrera FROM carrera WHERE nombre=?`,usuario.carrera);
                  const idCarrera=idsCarreras[0].id_carrera;
      
                  await db.query('UPDATE alumno SET boleta=?, fk_id_carrera=? WHERE fk_id_usuario=?',[usuario.boleta,idCarrera,idUsuario]);
                }
                //ENVIAMOS RESPUESTA
                let errores=[];
                
                errores.push("Ninguno");
                let respuesta:any={errores}
                res.json(respuesta);
                
              }
              */
            }
            catch (e) {
                console.log("Error Metodo registrar usuario");
                errores.push("Consultas");
                let respuesta = { errores };
                res.json(respuesta);
            }
        });
    }
}
exports.usuarioController = new UsuarioController();
