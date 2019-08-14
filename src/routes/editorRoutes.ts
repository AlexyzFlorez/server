import {Router} from 'express';
import {editorController} from '../controllers/editorController'

class EditorRoutes
{
    public router: Router=Router();

    constructor()
    {
        this.configuracion();
    }

    configuracion()
    {
        //Pestaña iniciar sesion
        this.router.post('/iniciar-sesion',editorController.iniciarSesion);
        this.router.post('/recuperar-password',editorController.recuperarPassword);

        //Pestaña registro
        this.router.post('/preregistrar-usuario',editorController.preregistrarUsuario);
        this.router.get('/obtener-departamentos',editorController.obtenerDepartamentos); 
    }
}

const editorRoutes=new EditorRoutes();
export default editorRoutes.router;