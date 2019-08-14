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
        
    }
}

const usuarioRoutes=new UsuarioRoutes();
export default usuarioRoutes.router;