import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
const config = require('./config/config');

import path from 'path';
import database from './database';

import { bcriptjsConfig } from './lib/bcryptjs';
const uuid = require('uuid/v4');

import administradorRoutes from './routes/administrador.routes';
import usuarioRoutes from './routes/usuario.routes';
import editorRoutes from './routes/editor.routes';

import Usuario from './models/usuario.model';
import Departamento from './models/departamento.model';
import { opcionesSeleccionables } from './helpers/opcionesSeleccionables';


class Servidor {
    public app: Application;

    constructor() {
        this.app = express();
        this.configuracion();
        this.routes();
        database();
    }

    configuracion(): void {
        this.app.set('port', config.PORT || 3300);
        //this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    routes(): void {
        this.app.use(`${config.URI_API}/usuario`, usuarioRoutes);
        this.app.use(`${config.URI_API}/administrador`, administradorRoutes);
        this.app.use(`${config.URI_API}/editor`, editorRoutes);

        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    comenzarServidor() {
        this.app.listen(this.app.get('port'), () => {
            console.log("Servidor en puerto:", this.app.get('port'));

            //this.registrarAdmin();
            /*
            opcionesSeleccionables.registrarDepartamentos();
            opcionesSeleccionables.registrarActividades();
            opcionesSeleccionables.registrarCategorias();
            opcionesSeleccionables.registrarPonentes();
            opcionesSeleccionables.registrarPoblacion();
            */
        });
    }

    async registrarAdmin() {
        const departamento: any = await Departamento.find({ nombre: "Dirección" });

        let admin: any = {
            nombre: "Cesar Alexis",
            apellido_paterno: "Fajardo",
            apellido_materno: "Flores",
            telefono: "4921952109",
            num_empleado: "1234567",
            correo: "alexyz.of@gmail.com",
            password: bcriptjsConfig.encriptar("12345678"),
            estado_registro: "Registrado",
            tipo_usuario: config.TIPO_ADMINISTRADOR,
            codigo_res_password: uuid(),
            departamento:departamento[0]
        }

        let usuario = new Usuario(admin);
        await usuario.save();
    }
}

const servidor = new Servidor();
servidor.comenzarServidor();
