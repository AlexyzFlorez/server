import { Request, Response } from 'express';
import { bcriptjsConfig } from '../lib/bcryptjs';
import Departamento from '../models/departamento.model';
import Actividad from '../models/actividad.model';
import Ponente from '../models/ponente.model';
import Poblacion from '../models/poblacion.model';
import Categoria from '../models/categoria.model';
import Evento from '../models/evento.model';

class UsuarioController {
    //Menu lateral
    public async obtenerNumeroEventos(req: Request, res: Response) {
        let errores = [];
        let arregloActividades = [];

        try {
            const actividades: any = await Actividad.find().sort({nombre:1});
            const todosEventos: any = await Evento.find();

            let elementoArreglo =
            {
                _id:"7c3d4ab1-38e6-4406-87b5-ecee274e3f5b",
                nombre: "Todos",
                numero: todosEventos.length
            }

            arregloActividades.push(elementoArreglo)

            for (let i = 0; i < actividades.length; i++) {
                let eventos: any = await Evento.find({ tipo_actividad: actividades[i]});
                let numeroEventos=eventos.length;

                let elementoArreglo =
                {
                    _id:actividades[i]._id,
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
            let actividades: any = await Actividad.find({ _id: idActividad });
            
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

    //Eventos
    public async obtenerEventos(req: Request, res: Response) {
        let errores = [];

        try {
    
            let eventos:any;
            let idActividad=req.params.idActividad;

            let actividad={
                _id:idActividad
            }

            if(idActividad=="7c3d4ab1-38e6-4406-87b5-ecee274e3f5b")
            {
                 eventos = await Evento.find().populate(['departamento', 'tipo_actividad', 'categoria', 'ponentes', 'poblacion', 'usuario']).sort({fecha_inicio:1});
            }
            else{
                 eventos = await Evento.find({tipo_actividad:actividad}).populate(['departamento', 'tipo_actividad', 'categoria', 'ponentes', 'poblacion','usuario']).sort({fecha_inicio:1});
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
            const evento: any = await Evento.find({_id:req.params.id}).populate(['departamento', 'tipo_actividad', 'categoria', 'ponentes', 'poblacion', 'usuario']);

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
        console.log("Obtener eventos calendario")
        let errores = [];

        try {

            const eventos: any = await Evento.find({}).populate(['departamento', 'tipo_actividad', 'categoria', 'ponentes', 'poblacion', 'usuario']).sort({fecha_inicio:1});
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

