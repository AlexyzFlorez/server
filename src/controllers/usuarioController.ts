import {Request, Response} from 'express';
import db from '../database'; 
import { Usuario } from '../models/Usuario';
import { bcriptjsConfig } from '../lib/bcyipjs';
const uuid=require('uuid/v4');

class UsuarioController
{
    public async obtenerDepartamentos(req:Request, res: Response)
    {
      console.log("Obteniendo departamentos")
      let errores = [];
      try
       {
          const departamentos = await db.query(`SELECT nombre FROM departamento`);
          res.json(departamentos);
        }
        catch(e)
        {
            console.log("Error metodo obtener departamentos");
            errores.push("Consultas")
            let respuesta:any={errores}
            res.json(respuesta);
        }
    }

    public async preregistrarUsuario(req:Request, res: Response)
    {
      let errores=[];
        try
        {
            console.log(req.body)
            
            let usuario=new Usuario();
            usuario.id_usuario=uuid();
            usuario.nombre=req.body.nombre; 
            usuario.apellido_paterno=req.body.apellido_paterno; 
            usuario.apellido_materno=req.body.apellido_materno; 
            usuario.telefono=req.body.telefono;
            usuario.num_empleado=req.body.num_empleado;
            usuario.correo=req.body.correo; 
            usuario.password=bcriptjsConfig.encriptar(req.body.password); 
            usuario.estado_registro=req.body.estado_registro; 
            usuario.tipo="Editor";
        
            //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
            const correoRegistrados=await db.query(`SELECT * FROM usuario WHERE correo=?`,usuario.correo);
            
            if(correoRegistrados.length>0)
            {
                errores.push("Usuario registrado");
            }

            const numEmpleados=await db.query(`SELECT num_empleado FROM usuario WHERE num_empleado=?`,usuario.num_empleado);
          
            if(numEmpleados.length>0)
            {
              errores.push("Num empleado registrado");
            }
  
          //SI HUBO ERRORES DE CAMPOS REGITRADOS
          if(errores.length>0)
          {
            let respuesta:any={errores}
            console.log("Hay campos invalidos en el servidor")
            res.json(respuesta)
          }
          else
          {
            //INSERTAMOS DATOS---------------------------------------------
            console.log("No hay errores en la respuesta")

            const departamento=await db.query(`SELECT * FROM departamento WHERE nombre=?`,req.body.departamento);
            usuario.fk_id_departamento=departamento[0].id_departamento;
  
            await db.query(`INSERT INTO usuario (id_usuario, nombre, apellido_paterno, apellido_materno, num_empleado, telefono, correo, password, tipo, estado_registro, fk_id_departamento) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,[usuario.id_usuario, usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno, usuario.num_empleado, usuario.telefono, usuario.correo, usuario.password, usuario.tipo, usuario.estado_registro, usuario.fk_id_departamento]);
            //ENVIAMOS RESPUESTA
            let errores=[];
            errores.push("Ninguno");
            let respuesta:any={errores}
            res.json(respuesta);
            
          }
        }
        catch(e)
        {
            console.log("Error metodo preregistrar usuario");
            errores.push("Consultas")
            let respuesta:any={errores}
            res.json(respuesta);
        }
    }
}

export const usuarioController=new UsuarioController();

