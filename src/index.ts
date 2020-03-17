import express,{Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
const config = require('./config/config');
import path from 'path';
import database from './database';

import administradorRoutes from './routes/administrador.routes';
import usuarioRoutes from './routes/usuario.routes';
import editorRoutes from './routes/editor.routes';

class Servidor
{
    public app:Application;

    constructor()
    {
        this.app=express();
        this.configuracion();
        this.routes();
        database();
    }

    configuracion():void
    {
        this.app.set('port', config.PORT || 3300);
         //this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:true}));     
    }

    routes():void
    {
        this.app.use(`${config.URI_API}/usuario`, usuarioRoutes);
        this.app.use(`${config.URI_API}/administrador`, administradorRoutes);
        this.app.use(`${config.URI_API}/editor`, editorRoutes);
    
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
