import { Request, Response } from 'express';
import db from '../database';
import { Usuario } from '../models/Usuario';
import { bcriptjsConfig } from '../lib/bcyipjs';
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
import { email } from '../lib/nodemailer';
import { VariablesGlobales } from '../models/VariablesGlobales';

class EditorController {
  public async iniciarSesion(req: any, res: Response) {
    let errores = [];
    try {
      let correo = req.body.correo;
      let password = req.body.password;

      const correoRegistrados = await db.query(`SELECT * FROM usuario WHERE correo=?`, correo);
      let estadoUsuario;

      if (correoRegistrados.length > 0) {
        estadoUsuario = correoRegistrados[0].estado_registro;
        //Si existe el correo y esta registrado
        if (estadoUsuario == 'Registrado') {
          const idUsuario = correoRegistrados[0].id_usuario;

          const passwords = await db.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
          const passwordBase = passwords[0].password; //Contraseña de la base de datos

          if (!bcriptjsConfig.comparar(password, passwordBase)) {
            errores.push("Password incorrecta");
            let respuesta: any = { errores }
            res.json(respuesta);
          }
          else {
            const tipoUsuarios = await db.query(`SELECT * FROM usuario WHERE correo=?`, correo);
            const tipoUsuario = tipoUsuarios[0].tipo;

            //Crear TOKEN
            const usuario = new Usuario();
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
          let respuesta: any = { errores }
          res.json(respuesta);
        }
      }
      else {
        errores.push("Usuario no registrado");
        let respuesta: any = { errores }
        res.json(respuesta);
      }

    } catch (e) {
      console.log("Error metodo iniciar sesion");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }
  //----------------------------------------------------------------------------------------------
  public async validarCodigoPassword(req: Request, res: Response) {
    let errores = [];
    try {
      let codigo=req.params.codigo;
      const codigos = await db.query(`SELECT * FROM usuario WHERE codigo_res_password=?`,codigo);
      if(codigos.length>0)
      {
        errores.push("Ninguno")
      }
      else{
        errores.push("Codigo incorrecto")
      }
      let respuesta: any = { errores }
      res.json(respuesta);
    }
    catch (e) {
      console.log("Error metodo validar codigo");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async recuperarPassword(req: Request, res: Response) {
    let errores = [];
    try {
      let correo = req.body.correo;
      let errores = [];

      let banderaCorreo = false;

      const correoRegistrados = await db.query(`SELECT * FROM usuario WHERE correo=?`, correo);

      if (correoRegistrados.length > 0) {
        banderaCorreo = false;
      }
      else {
        banderaCorreo = true;
        errores.push("Correo no registrado");
      }

      if (!banderaCorreo) {
        const usuario = await db.query(`SELECT * FROM usuario WHERE correo=?`, correo);
        const codigo = usuario[0].codigo_res_password;
        
        email.enviarCorreo(correo, 'Restablecimiento de contraseña', `
        <div style='width:30vw; padding:50px; display:block; border:1px solid #16B4FC; text-align:center; margin:0 auto'>
          <p style='width:100%; color:#53575A'>Haz solicitado el restablecimiento de tu contraseña en SisEvent</p>
          <a href='${VariablesGlobales.dominio}/restablecer-password/${codigo}' style='text-decoration:none; background:#16B4FC; color:#fff; border-radius:20px;padding:10px; font-size:14px; width:100%; display:block; text-align:center; margin:0 auto'>Restablecer contraseña</a>
        </div>`
        );
        errores.push("Ninguno");
      }
      else {
        console.log("Correo no registrado");
      }
      let respuesta: any = { errores }
      res.json(respuesta);

    } catch (e) {
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async restablecerPassword(req: Request, res: Response) {
    let errores:any = [];
    try {
      
      let password=req.body.password;
      let codigo=req.body.codigo_res_password;

      const codigos = await db.query(`SELECT * FROM usuario WHERE codigo_res_password=?`,codigo);
      if(codigos.length<1)
      {
        errores.push("Codigo incorrecto")
      }
      else{
        let nuevaPassword = bcriptjsConfig.encriptar(password);
        let nuevoCodigo=uuid();

        await db.query('UPDATE usuario SET password=?, codigo_res_password=? WHERE codigo_res_password=?', [nuevaPassword,nuevoCodigo,codigo]);
        errores.push("Ninguno")
      }
    
      let respuesta: any = { errores }
      res.json(respuesta);
    }
    catch (e) {
      console.log("Error metodo restablecer codigo");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async obtenerDepartamentos(req: Request, res: Response) {
    let errores = [];
    try {
      const departamentos = await db.query(`SELECT nombre FROM departamento`);
      res.json(departamentos);
    }
    catch (e) {
      console.log("Error metodo obtener departamentos");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async preregistrarUsuario(req: Request, res: Response) {
    let errores = [];
    try {
      let usuario = new Usuario();
      usuario.id_usuario = uuid();
      usuario.nombre = req.body.nombre;
      usuario.apellido_paterno = req.body.apellido_paterno;
      usuario.apellido_materno = req.body.apellido_materno;
      usuario.telefono = req.body.telefono;
      usuario.num_empleado = req.body.num_empleado;
      usuario.correo = req.body.correo;
      //usuario.password=req.body.password; 
      usuario.password = bcriptjsConfig.encriptar(req.body.password);
      usuario.estado_registro = req.body.estado_registro;
      usuario.tipo = "$2a$10$m3XP./02B3jWnBX1YV.Ua.vWD2LXw/oC81eAjnPaJrqV0ImnD3SxW";
      usuario.codigo_res_password=uuid();

      //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
      const correoRegistrados = await db.query(`SELECT * FROM usuario WHERE correo=?`, usuario.correo);

      if (correoRegistrados.length > 0) {
        errores.push("Usuario registrado");
      }

      const numEmpleados = await db.query(`SELECT num_empleado FROM usuario WHERE num_empleado=?`, usuario.num_empleado);

      if (numEmpleados.length > 0) {
        errores.push("Num empleado registrado");
      }

      //SI HUBO ERRORES DE CAMPOS REGITRADOS
      if (errores.length > 0) {
        let respuesta: any = { errores }
        console.log("Hay campos invalidos en el servidor")
        res.json(respuesta)
      }
      else {
        //INSERTAMOS DATOS---------------------------------------------
        console.log("No hay errores en la respuesta")

        const departamento = await db.query(`SELECT * FROM departamento WHERE nombre=?`, req.body.departamento);
        usuario.fk_id_departamento = departamento[0].id_departamento;

        await db.query(`INSERT INTO usuario (id_usuario, nombre, apellido_paterno, apellido_materno, num_empleado, telefono, correo, password, tipo, estado_registro, fk_id_departamento, codigo_res_password) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, [usuario.id_usuario, usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno, usuario.num_empleado, usuario.telefono, usuario.correo, usuario.password, usuario.tipo, usuario.estado_registro, usuario.fk_id_departamento,usuario.codigo_res_password]);
        
        const correosAdministrador = await db.query(`SELECT correo FROM usuario WHERE tipo=?`,"$2a$10$kAuF.n3BG7N8rXpqKnGziOkk8jplw4DWVdkUshhsc3Bvt8YVx2Yom");
        const correoAdministrador=correosAdministrador[0].correo;
        
        email.enviarCorreo(correoAdministrador,'Solicitud de registro',`<p>Hay una nueva solicitud de registro al sistema SisEvent</p>`);
        //ENVIAMOS RESPUESTA
        let errores = [];
        errores.push("Ninguno");
        let respuesta: any = { errores }
        res.json(respuesta);

      }
    }
    catch (e) {
      console.log("Error metodo preregistrar usuario");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async obtenerPerfil(req: Request, res: Response) {
    let errores = [];
    try {
      const idUsuario = req.params.id
      const usuario = await db.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);

      if (usuario[0].fk_id_departamento != null) {
        let departamentos = await db.query(`SELECT * FROM departamento WHERE id_departamento=?`, usuario[0].fk_id_departamento);
        const departamento = departamentos[0].nombre;
        usuario[0].departamento = departamento;
      }

      res.json(usuario);
    }
    catch (e) {
      console.log("Error metodo obtener perfil");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async actualizarPerfil(req: Request, res: Response) {
    let errores = [];
    try {
      let usuario = new Usuario();
      const idUsuario = req.params.id
      const existe = await db.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);

      if (existe.length > 0) {
        usuario.nombre = req.body.nombre;
        usuario.apellido_paterno = req.body.apellido_paterno;
        usuario.apellido_materno = req.body.apellido_materno;
        usuario.telefono = req.body.telefono;
        usuario.num_empleado = req.body.num_empleado;
        usuario.correo = req.body.correo;
        usuario.password = bcriptjsConfig.encriptar(req.body.password);
        usuario.estado_registro = req.body.estado_registro;
        const departamento = await db.query(`SELECT * FROM departamento WHERE nombre=?`, req.body.departamento);
        usuario.fk_id_departamento = departamento[0].id_departamento;
      
        //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
        const correoRegistrados = await db.query(`SELECT * FROM usuario WHERE correo=? AND id_usuario!=?`, [usuario.correo, idUsuario]);

        if (correoRegistrados.length > 0) {
          errores.push("Usuario registrado");
        }

        const numEmpleados = await db.query(`SELECT num_empleado FROM usuario WHERE num_empleado=? AND id_usuario!=?`, [usuario.num_empleado, idUsuario]);

        if (numEmpleados.length > 0) {
          errores.push("Num empleado registrado");
        }

        //SI HUBO ERRORES DE CAMPOS REGITRADOS
        if (errores.length > 0) {
          console.log("Hay campos invalidos en el servidor")
        }
        else {
          //INSERTAMOS DATOS---------------------------------------------
          console.log("No hay errores en la respuesta")

          await db.query('UPDATE usuario SET nombre=?, apellido_paterno=?, apellido_materno=?, telefono=?, num_empleado=?, fk_id_departamento=?, correo=?, password=? WHERE id_usuario=?', [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno, usuario.telefono, usuario.num_empleado, usuario.fk_id_departamento, usuario.correo, usuario.password, idUsuario]);

          errores.push("Ninguno");
        }
      }
      else {
        errores.push("No existe")
      }

      let respuesta: any = { errores }
      res.json(respuesta);

    } catch (e) {
      console.log("Error metodo actualizar alumno");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

}

export const editorController = new EditorController();

