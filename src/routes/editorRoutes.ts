import {Router} from 'express';
import {editorController} from '../controllers/editorController'
import { auth } from '../middleware/auth';
import {multerConfig} from '../lib/multer';

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
        this.router.get('/obtener-actividades',editorController.obtenerActividades);
        this.router.get('/obtener-categorias',editorController.obtenerCategorias);
        this.router.get('/obtener-ponentes',editorController.obtenerPonentes);
        this.router.get('/obtener-poblacion',editorController.obtenerPoblacion);
        
        //Pestaña perfil
        this.router.get('/obtener-perfil/:id',[auth.verificarToken,auth.verificarEditor],editorController.obtenerPerfil);
        this.router.put('/actualizar-perfil/:id',[auth.verificarToken,auth.verificarEditor],editorController.actualizarPerfil);
    
        //Pestaña restablecer password
        this.router.get('/validar-codigo-password/:codigo',editorController.validarCodigoPassword);
        this.router.put('/restablecer-password/:codigo',editorController.restablecerPassword);

        //Registrar evento
        this.router.post('/registrar-evento',[auth.verificarToken,auth.verificarEditor,multerConfig],editorController.registrarEvento);
    }
}

const editorRoutes=new EditorRoutes();
export default editorRoutes.router;