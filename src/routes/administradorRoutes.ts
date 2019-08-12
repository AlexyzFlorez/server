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
        this.router.get('/obtener-usuarios',administradorController.obtenerUsuarios);
        this.router.put('/aceptar-usuario/:id',administradorController.aceptarUsuario);
        this.router.delete('/rechazar-usuario/:id',administradorController.rechazarUsuario);
        this.router.delete('/eliminar-usuario/:id',administradorController.eliminarUsuario);
    }
}

const administradorRoutes=new AdministradorRoutes();
export default administradorRoutes.router;