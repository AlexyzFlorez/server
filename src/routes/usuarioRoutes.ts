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
    }
}

const usuarioRoutes=new UsuarioRoutes();
export default usuarioRoutes.router;