const jwt=require ('jsonwebtoken');
var SEED =require('../config/config').SEED;

class Auth
{
    public verificarToken(req:any,res:any,next:any)
    {
        var token=req.query.token;

        jwt.verify(token,SEED,(err:any,decoded:any)=>{
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

        if(usuario.tipo==="Administrador")
        {
            next();
            return;
        }
        else
        {
            return res.status(401).json({
                ok:false,
                mensaje:'Error 1',
                errors:{mensaje:"Error 1"}
            })
        }
    }

    public verificarUsuario(req:any,res:any,next:any)
    {
        var usuario=req.usuario;

        if(usuario.tipo==="Normal")
        {
            next();
            return;
        }
        else
        {
            return res.status(401).json({
                ok:false,
                mensaje:'Error 2',
                errors:{mensaje:"Error 2"}
            })
        }
    }

}

export const auth=new Auth();