import { Request, Response } from 'express';
import db from '../database';
import { email } from '../lib/nodemailer';
import { VariablesGlobales } from '../models/VariablesGlobales';

class AdministradorController {
    //Mostrar Titulares
    public async obtenerUsuarios(req: Request, res: Response) {
        let errores: any = [];

        try {
            const usuarios = await db.query(`SELECT * FROM usuario WHERE tipo=?`,"$2a$10$m3XP./02B3jWnBX1YV.Ua.vWD2LXw/oC81eAjnPaJrqV0ImnD3SxW");
            for (let i = 0; i < usuarios.length; i++) {
                let idDepartamento = usuarios[i].fk_id_departamento;

                let departamentos = await db.query(`SELECT * FROM departamento WHERE id_departamento=?`, idDepartamento);
                let departamento = departamentos[0].nombre;
                usuarios[i].nombre_departamento = departamento;
            }
            res.json(usuarios);
        }
        catch (e) {
            console.log("Error metodo obtener usuarios");
            errores.push("Consultas")
            let respuesta: any = { errores }
            res.json(respuesta);
        }
    }

    public async aceptarUsuario(req: Request, res: Response) {
        let errores = [];
        try {
            const idUsuario = req.params.id;
            const usuario = await db.query(`SELECT correo FROM usuario WHERE id_usuario=?`,idUsuario);
            const correoUsuario=usuario[0].correo;

            await db.query('UPDATE usuario SET estado_registro=? WHERE id_usuario=?', ["Registrado", idUsuario]);
            errores.push("Ninguno")

            email.enviarCorreo(correoUsuario,'Respuesta a solicitud de registro a SisEvent',`<p>Tu solicitud de registro ha sido <strong>ACEPTADA </strong><a href="${VariablesGlobales.dominio}/login">Ir a SisEvent</a></p>`);
            let respuesta: any = { errores }
            res.json(respuesta);

        }
        catch (e) {
            console.log("Error metodo aceptar usuario");
            errores.push("Consultas")
            let respuesta: any = { errores }
            res.json(respuesta);
        }
    }

    public async rechazarUsuario(req: Request, res: Response) {
        let errores = [];
        try {

            const idUsuario = req.params.id;
            let usuario = await db.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
            let correoUsuario = usuario[0].correo;

            //ENVIAR CORREO ELECTRONICO NOTIFICANDOLE
            await db.query(`DELETE FROM usuario WHERE id_usuario=?`, idUsuario);
            errores.push("Ninguno")

            email.enviarCorreo(correoUsuario,'Respuesta a solicitud de registro a SisEvent',`<p>Tu solicitud de registro ha sido <strong>RECHAZADA</strong>.</p>`);

            let respuesta: any = { errores }
            res.json(respuesta);

        }
        catch (e) {
            console.log("Error metodo rechazar usuario");
            errores.push("Consultas")
            let respuesta: any = { errores }
            res.json(respuesta);
        }
    }

    public async eliminarUsuario(req: Request, res: Response) {
        let errores = [];
        try {

            const idUsuario = req.params.id;
            let usuario = await db.query(`SELECT * FROM usuario WHERE id_usuario=?`, idUsuario);
            let correo = usuario[0].correo;

            //ENVIAR CORREO ELECTRONICO NOTIFICANDOLE

            await db.query(`DELETE FROM usuario WHERE id_usuario=?`, idUsuario);
            errores.push("Ninguno")

            let respuesta: any = { errores }
            res.json(respuesta);

        }
        catch (e) {
            console.log("Error metodo eliminar usuario");
            errores.push("Consultas")
            let respuesta: any = { errores }
            res.json(respuesta);
        }
    }
}

export const administradorController = new AdministradorController();

