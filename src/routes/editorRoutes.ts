import {Router} from 'express';
import {editorController} from '../controllers/editorController'
import { auth } from '../middleware/auth';

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
        
        //Pestaña perfil
        this.router.get('/obtener-perfil/:id',[auth.verificarToken,auth.verificarEditor],editorController.obtenerPerfil);
        this.router.put('/actualizar-perfil/:id',[auth.verificarToken,auth.verificarEditor],editorController.actualizarPerfil);
    }
}

const editorRoutes=new EditorRoutes();
export default editorRoutes.router;