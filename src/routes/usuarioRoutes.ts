import {Router} from 'express';
import {usuarioController} from '../controllers/usuarioController'

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
        this.router.get('/obtener-eventos/:id',usuarioController.obtenerEventos);
        this.router.get('/obtener-detalles-evento/:id',usuarioController.obtenerDetallesEvento);

    }
}

const usuarioRoutes=new UsuarioRoutes();
export default usuarioRoutes.router;