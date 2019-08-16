import express,{Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import administradorRoutes from './routes/administradorRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import editorRoutes from './routes/editorRoutes';

import path from 'path';

class Servidor
{
    public app:Application;

    constructor()
    {
        this.app=express();
        this.configuracion();
        this.routes();
    }

    configuracion():void
    {
        this.app.set('port', process.env.PORT || 3000);
         //this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:true}));     
    }

    routes():void
    {
        this.app.use('/api/sis-event/usuario', usuarioRoutes);
        this.app.use('/api/sis-event/administrador', administradorRoutes);
        this.app.use('/api/sis-event/editor', editorRoutes);
    
        this.app.use(express.static(path.join(__dirname,'public')));
    }

    comenzarServidor()
    {
        this.app.listen(this.app.get('port'),()=>{
            console.log("Servidor en puerto", this.app.get('port'));
        });
    }
}

const servidor=new Servidor();
servidor.comenzarServidor();
