const jwt=require ('jsonwebtoken');
const config = require('../config/config');

class Auth
{
    public verificarToken(req:any,res:any,next:any)
    {
        
        var token=req.query.token;

        jwt.verify(token,config.SEED,(err:any,decoded:any)=>{
            if(err)
            {
                return res.status(401).json({
                    ok:false,
                    mensaje:'Token incorrecto',
                    errors:err
                })
            }
            //Para tener la informacion del usuario en el request
            req.usuario=decoded.usuario;
            next();
        });
    }

    public verificarAdministrador(req:any,res:any,next:any)
    {
        var usuario=req.usuario;

        if(usuario.tipo===config.TIPO_EDITOR)
        {
            next();
            return;
        }
        else
        {
            return res.status(401).json({
                ok:false,
                mensaje:'No eres editor',
                errors:{mensaje:"No eres editor"}
            })
        }
    }

    public verificarEditor(req:any,res:any,next:any)
    {
        var usuario=req.usuario;

        if(usuario.tipo===config.TIPO_EDITOR || usuario.tipo===config.TIPO_ADMINISTRADOR)
        {
            next();
            return;
        }
        else
        {
            return res.status(401).json({
                ok:false,
                mensaje:'No eres administrador',
                errors:{mensaje:"No eres administardor"}
            })
        }
    }
}

export const auth=new Auth();