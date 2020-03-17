import { Request, Response } from 'express';
import { bcriptjsConfig } from '../lib/bcyipjs';
import Departamento from '../models/departamento.model';
import Actividad from '../models/actividad.model';
import Ponente from '../models/ponente.model';
import Poblacion from '../models/poblacion.model';
import Categoria from '../models/categoria.model';
import Evento from '../models/evento.model';

class UsuarioController {
    public async obtenerNumeroEventos(req: Request, res: Response) {
        let errores = [];
        let arregloActividades = [];

        try {
            const actividades: any = await Actividad.find().sort({nombre:1});
            const todosEventos: any = await Evento.find();

            let elementoArreglo =
            {
                id:"7c3d4ab1-38e6-4406-87b5-ecee274e3f5b",
                nombre: "Todos",
                numero: todosEventos.length
            }

            arregloActividades.push(elementoArreglo)

            for (let i = 0; i < actividades.length; i++) {
                let eventos: any = await Evento.find({ tipo_actividad: actividades[i].id_actividad });
                let numeroEventos=eventos.length;

                let elementoArreglo =
                {
                    id:actividades[i].id_actividad,
                    nombre: actividades[i].nombre,
                    numero: numeroEventos
                }
    
                arregloActividades.push(elementoArreglo)
            }
            res.json(arregloActividades);
        }
        catch (e) {
            console.log("Error metodo obtener numero eventos");
            errores.push("Consultas")
            let respuesta: any = { errores }
            res.json(respuesta);
        }
    }

    public async obtenerNombreActividad(req: Request, res: Response) {
        let errores = [];
        const idActividad = req.params.id;
       
        try {
            let actividades: any = await Actividad.find({ tipo_actividad: idActividad });
            
            let nombreActividad=actividades[0].nombre;
            res.json(nombreActividad);
        }
        catch (e) {
            console.log("Error metodo obtener nombre actividad");
            errores.push("Consultas")
            let respuesta: any = { errores }
            res.json(respuesta);
        }
    }

    public async obtenerEventos(req: Request, res: Response) {
        let errores = [];

        try {
    
            let eventos:any;
            let idActividad=req.params.idActividad;
            if(idActividad=="7c3d4ab1-38e6-4406-87b5-ecee274e3f5b")
            {
                const eventos: any = await Evento.find().sort({fecha_inicio:1});
            }
            else{
                const eventos: any = await Evento.find({tipo_actividad:idActividad}).sort({fecha_inicio:1});
            }

            for (let i = 0; i < eventos.length; i++) {
                const nombresDepartamentos: any = await Departamento.find({departamento:eventos[i].departamento});
                eventos[i].departamento=nombresDepartamentos[0].nombre;

                const nombresCategoria: any = await Categoria.find({categoria:eventos[i].categoria});
                eventos[i].categoria=nombresCategoria[0].nombre;

                const nombresPonentes: any = await Ponente.find({ponentes:eventos[i].ponentes});
                eventos[i].ponentes=nombresPonentes[0].tipo;

                const nombresPoblacion: any = await Poblacion.find({poblacion:eventos[i].poblacion});
                eventos[i].poblacion=nombresPoblacion[0].tipo;

                const nombresActividades: any = await Actividad.find({tipo_actividad:eventos[i].tipo_actividad});
                eventos[i].actividad=nombresActividades[0].nombre;
            }
            
            res.json(eventos);
        }
        catch (e) {
            console.log("Error metodo obtener eventos");
            errores.push("Consultas")
            let respuesta: any = { errores }
            res.json(respuesta);
        }
    }

    public async obtenerDetallesEvento(req: Request, res: Response) {
        let errores = [];
        try {
            const evento: any = await Evento.find({id_evento:req.params.id});
     
            const nombresDepartamentos: any = await Departamento.find({id_departamento:evento[0].departamento});
            evento[0].departamento=nombresDepartamentos[0].nombre;

            const nombresCategoria: any = await Categoria.find({id_categoria:evento[0].categoria});
            evento[0].categoria=nombresCategoria[0].nombre;

            const nombresPonentes: any = await Ponente.find({id_ponentes:evento[0].ponentes});
            evento[0].ponentes=nombresPonentes[0].nombre;

            const nombresPoblacion: any = await Poblacion.find({id_poblacion:evento[0].poblacion});
            evento[0].poblacion=nombresPoblacion[0].nombre;

            const nombresActividades: any = await Actividad.find({id_actividad:evento[0].tipo_actividad});
            evento[0].actividad=nombresActividades[0].nombre;

            res.json(evento[0]);
        }
        catch (e) {
            console.log("Error metodo obtener detalles evento");
            errores.push("Consultas")
            let respuesta: any = { errores }
            res.json(respuesta);
        }
    }

    public async obtenerEventosCalendario(req: Request, res: Response) {
        let errores = [];

        try {

            const eventos: any = await Evento.find({});

            for (let i = 0; i < eventos.length; i++) {

                const nombresDepartamentos: any = await Departamento.find({id_departamento:eventos[0].departamento});
                eventos[0].departamento=nombresDepartamentos[0].nombre;
    
                const nombresCategoria: any = await Categoria.find({id_categoria:eventos[0].categoria});
                eventos[0].categoria=nombresCategoria[0].nombre;
    
                const nombresPonentes: any = await Ponente.find({id_ponentes:eventos[0].ponentes});
                eventos[0].ponentes=nombresPonentes[0].nombre;
    
                const nombresPoblacion: any = await Poblacion.find({id_poblacion:eventos[0].poblacion});
                eventos[0].poblacion=nombresPoblacion[0].nombre;
    
                const nombresActividades: any = await Actividad.find({id_actividad:eventos[0].tipo_actividad});
                eventos[0].actividad=nombresActividades[0].nombre;
                
                eventos[i].title=eventos[i].nombre;
                /*
                eventos[i].start=new Date(2019, 5, 12, 8, 30);
                eventos[i].end=new Date(2019, 5, 12, 8, 30);
                */

                /*
                let start;
                
                let fechaString=(eventos[i].fecha_inicio).toString();
                console.log(fechaString)
                //let soloFecha=eventos[i].fecha_inicio.substring(0,10);
  
                //new Date(2019, 5, 12, 8, 30),
                let end;
                */
            }
            
            console.log(eventos)
            res.json(eventos);
        }
        catch (e) {
            console.log("Error metodo obtener eventos calendario");
            errores.push("Consultas")
            let respuesta: any = { errores }
            res.json(respuesta);
        }
    }

}

export const usuarioController = new UsuarioController();

