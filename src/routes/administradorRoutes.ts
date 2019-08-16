import {Router} from 'express';
import {administradorController} from '../controllers/administradorController'
import { auth } from '../middleware/auth';

class AdministradorRoutes
{
    public router: Router=Router();

    constructor()
    {
        this.configuracion();
    }

    configuracion()
    {
        this.router.get('/obtener-usuarios',[auth.verificarToken,auth.verificarAdministrador],administradorController.obtenerUsuarios);
        this.router.put('/aceptar-usuario/:id',[auth.verificarToken,auth.verificarAdministrador],administradorController.aceptarUsuario);
        this.router.delete('/rechazar-usuario/:id',[auth.verificarToken,auth.verificarAdministrador],administradorController.rechazarUsuario);
        this.router.delete('/eliminar-usuario/:id',[auth.verificarToken,auth.verificarAdministrador],administradorController.eliminarUsuario);
    }
}

const administradorRoutes=new AdministradorRoutes();
export default administradorRoutes.router;