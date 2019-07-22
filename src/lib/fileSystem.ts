const fs=require('fs');
const path=require('path');

class Fsystem
{  
    public eliminarArchivo(nombre:any)
    {
        setTimeout(() => {
            var ruta=path.join(__dirname,`../public/archivos/${nombre}`);
            fs.unlink(ruta,function (err:any) {
                if(err)
                {
                    console.log("Error al eliminar archivo")
                    console.log(err);
                }
                else{
                    console.log("Archivo eliminado")
                }
            });
          }, 3000);
       
    }
}

export const fSystem=new Fsystem();