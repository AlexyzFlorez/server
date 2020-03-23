import { Request, Response } from 'express';
import { email } from '../lib/nodemailer';
const config = require('../config/config');
import Usuario from '../models/usuario.model';
import Evento from '../models/evento.model';

class AdministradorController {
    //Usuarios
    public async obtenerUsuarios(req: Request, res: Response) {
        let errores: any = [];

        try {
            const usuarios: any = await Usuario.find({}).populate('departamento').sort({ nombre: 1 });
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

            let usuario: any = await Usuario.find({ '_id': idUsuario });
            const correoUsuario = usuario[0].correo;
            await Usuario.findByIdAndUpdate(idUsuario, { estado_registro: "Registrado" });

            errores.push("Ninguno")

            email.enviarCorreo(correoUsuario, 'Respuesta a solicitud de registro a SisEvent', `<p>Tu solicitud de registro ha sido <strong>ACEPTADA </strong><a href="${config.URI_CLIENT}/login">Ir a SisEvent</a></p>`);
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
            let usuario: any = await Usuario.find({ '_id': idUsuario });
            const correoUsuario = usuario[0].correo;

            //ENVIAR CORREO ELECTRONICO NOTIFICANDOLE
            await Usuario.findByIdAndDelete(idUsuario);
            errores.push("Ninguno")

            email.enviarCorreo(correoUsuario, 'Respuesta a solicitud de registro a SisEvent', `<p>Tu solicitud de registro ha sido <strong>RECHAZADA</strong>.</p>`);

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
            await Usuario.findByIdAndDelete(idUsuario);
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

    //Eventos
    public async obtenerEventosEnMemoria(req: Request, res: Response) {
        let errores = [];

        try {

            let eventos: any;

            eventos = await Evento.find({ en_memoria: true }).populate(['departamento', 'tipo_actividad', 'categoria', 'ponentes', 'poblacion', 'usuario']).sort({ fecha_inicio: 1 });

            res.json(eventos);
        }
        catch (e) {
            console.log("Error metodo obtener eventos en memoria");
            errores.push("Consultas")
            let respuesta: any = { errores }
            res.json(respuesta);
        }
    }

    //Perfil
    public async actualizarMemoria(req: Request, res: Response) {
        let errores = [];
        try {
            const idEvento = req.params.id;
            let actualizacion = req.body.en_memoria;

            await Evento.findByIdAndUpdate(idEvento, { en_memoria: actualizacion });
            errores.push("Ninguno")

            let respuesta: any = { errores }
            res.json(respuesta);
        }
        catch (e) {
            console.log("Error metodo actualizar memoria");
            errores.push("Consultas")
            let respuesta: any = { errores }
            res.json(respuesta);
        }
    }
}

export const administradorController = new AdministradorController();

