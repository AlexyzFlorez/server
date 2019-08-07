"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class EditorRoutes {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
    }
}
const editorRoutes = new EditorRoutes();
exports.default = editorRoutes.router;
