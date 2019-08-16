"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const administradorRoutes_1 = __importDefault(require("./routes/administradorRoutes"));
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const editorRoutes_1 = __importDefault(require("./routes/editorRoutes"));
const path_1 = __importDefault(require("path"));
class Servidor {
    constructor() {
        this.app = express_1.default();
        this.configuracion();
        this.routes();
    }
    configuracion() {
        this.app.set('port', process.env.PORT || 3000);
        //this.app.use(morgan('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        this.app.use('/api/sis-event/usuario', usuarioRoutes_1.default);
        this.app.use('/api/sis-event/administrador', administradorRoutes_1.default);
        this.app.use('/api/sis-event/editor', editorRoutes_1.default);
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    }
    comenzarServidor() {
        this.app.listen(this.app.get('port'), () => {
            console.log("Servidor en puerto", this.app.get('port'));
        });
    }
}
const servidor = new Servidor();
servidor.comenzarServidor();
