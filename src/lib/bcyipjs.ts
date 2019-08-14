import { Hash } from "crypto";

const multer=require('multer');
const bcript=require('bcryptjs');

class BcriptjsConfig
{
    public encriptar(password:string):string
    {
        const passwordEncriptada=bcript.hashSync(password,10);
        return passwordEncriptada;
    }

    public comparar(password:string, passwordBase:string):boolean
    {
        let aceptada;
        if(bcript.compareSync(password,passwordBase) || password==passwordBase)
        {
            aceptada=true;  
        }
        else
        {
            aceptada=false;
        }
        return aceptada; 
    }
}

export const bcriptjsConfig=new BcriptjsConfig();