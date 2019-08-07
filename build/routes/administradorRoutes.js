"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class AdministradorRoutes {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
    }
}
const administradorRoutes = new AdministradorRoutes();
exports.default = administradorRoutes.router;
