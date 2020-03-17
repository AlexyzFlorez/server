"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config = require('./config/config');
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./database"));
const administrador_routes_1 = __importDefault(require("./routes/administrador.routes"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const editor_routes_1 = __importDefault(require("./routes/editor.routes"));
class Servidor {
    constructor() {
        this.app = express_1.default();
        this.configuracion();
        this.routes();
        database_1.default();
    }
    configuracion() {
        this.app.set('port', config.PORT || 3300);
        //this.app.use(morgan('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        this.app.use(`${config.URI_API}/usuario`, usuario_routes_1.default);
        this.app.use(`${config.URI_API}/administrador`, administrador_routes_1.default);
        this.app.use(`${config.URI_API}/editor`, editor_routes_1.default);
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
