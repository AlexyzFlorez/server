"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class Email {
    enviarCorreo(destinatario, asunto, cuerpo) {
        let transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'testsisevent@gmail.com',
                pass: 'sisEventTesting'
            }
        });
        let emailOptions = {
            from: 'testsisevent@gmail.com',
            to: destinatario,
            subject: asunto,
            html: cuerpo
        };
        transporter.sendMail(emailOptions, function (error, info) {
            if (error) {
                console.log('Error al enviar email');
                console.log(error);
            }
            else {
                console.log('Email enviado');
            }
        });
    }
}
exports.email = new Email();
