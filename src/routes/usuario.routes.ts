import {Router} from 'express';
import {usuarioController} from '../controllers/usuario.controller'

class UsuarioRoutes
{
    public router: Router=Router();

    constructor()
    {
        this.configuracion();
    }

    configuracion()
    {
        //Sidebar actividades
        this.router.get('/obtener-numero-eventos',usuarioController.obtenerNumeroEventos);

        //Eventos
        this.router.get('/obtener-nombre-actividad/:id',usuarioController.obtenerNombreActividad);
        this.router.get('/obtener-eventos/:idActividad',usuarioController.obtenerEventos);
        this.router.get('/obtener-detalles-evento/:id',usuarioController.obtenerDetallesEvento);

        //Calendario
        this.router.get('/obtener-eventos-calendario',usuarioController.obtenerEventosCalendario);
    }
}

const usuarioRoutes=new UsuarioRoutes();
export default usuarioRoutes.router;