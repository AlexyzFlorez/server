"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require('multer');
const bcript = require('bcryptjs');
class BcriptjsConfig {
    encriptar(password) {
        const passwordEncriptada = bcript.hashSync(password, 10);
        return passwordEncriptada;
    }
    comparar(password, passwordBase) {
        let aceptada;
        if (bcript.compareSync(password, passwordBase) || password == passwordBase) {
            aceptada = true;
        }
        else {
            aceptada = false;
        }
        return aceptada;
    }
}
exports.bcriptjsConfig = new BcriptjsConfig();
