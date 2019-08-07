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
        
    }
}

const editorRoutes=new EditorRoutes();
export default editorRoutes.router;