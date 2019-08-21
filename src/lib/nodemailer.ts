import nodemailer from 'nodemailer';

class Email
{
    public enviarCorreo(destinatario:any, asunto:string, cuerpo:string)
    {
        let transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'testsisevent@gmail.com',
                pass:'sisEventTesting'
            }
        });
        
        let emailOptions={
            from:'testsisevent@gmail.com',
            to: destinatario,
            subject:asunto,
            html: cuerpo
        };
      
        transporter.sendMail(emailOptions,function(error:any,info:any){
            if(error)
            {
                console.log('Error al enviar email');
                console.log(error);
            }
            else
            {
                console.log('Email enviado');
            }
        });
    }
}

export const email=new Email();