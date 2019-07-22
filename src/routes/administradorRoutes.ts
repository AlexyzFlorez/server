import {Router} from 'express';
import {administradorController} from '../controllers/administradorController'

class AdministradorRoutes
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

const administradorRoutes=new AdministradorRoutes();
export default administradorRoutes.router;