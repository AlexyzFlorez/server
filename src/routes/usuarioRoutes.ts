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
         //Pestaña registro
         this.router.post('/preregistrar-usuario',usuarioController.preregistrarUsuario);
         this.router.get('/obtener-departamentos',usuarioController.obtenerDepartamentos);  
    }
}

const usuarioRoutes=new UsuarioRoutes();
export default usuarioRoutes.router;