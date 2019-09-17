import { Request, Response } from 'express';
import db from '../database';
import { Usuario } from '../models/Usuario';
import { bcriptjsConfig } from '../lib/bcyipjs';
const uuid = require('uuid/v4');

class UsuarioController {
    public async obtenerNumeroEventos(req: Request, res: Response) {
        let errores = [];
        let arregloActividades = [];

        try {
            let actividades = await db.query(`SELECT * FROM actividad ORDER BY nombre ASC`);
            let todosEventos = await db.query(`SELECT * FROM evento`);

            let elementoArreglo =
            {
                id:"7c3d4ab1-38e6-4406-87b5-ecee274e3f5b",
                nombre: "Todos",
                numero: todosEventos.length
            }

            arregloActividades.push(elementoArreglo)

            for (let i = 0; i < actividades.length; i++) {
                let eventos = await db.query(`SELECT * FROM evento WHERE fk_id_actividad=?`, actividades[i].id_actividad);
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
            let actividades = await db.query(`SELECT * FROM actividad WHERE id_actividad=?`, idActividad);
            
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

            let eventos;
            if(req.params.id=="7c3d4ab1-38e6-4406-87b5-ecee274e3f5b")
            {
                eventos = await db.query(`SELECT * FROM evento ORDER BY fecha_inicio ASC`);
            }
            else{
                eventos = await db.query(`SELECT * FROM evento WHERE fk_id_actividad=? ORDER BY fecha_inicio ASC `, req.params.id);
            }

            for (let i = 0; i < eventos.length; i++) {
                let nombresDepartamentos=await db.query(`SELECT nombre FROM departamento WHERE id_departamento=?`, eventos[i].fk_id_departamento);
                eventos[i].departamento=nombresDepartamentos[0].nombre;

                let nombresCategoria=await db.query(`SELECT nombre FROM categoria WHERE id_categoria=?`, eventos[i].fk_id_categoria);
                eventos[i].categoria=nombresCategoria[0].nombre;

                
                let nombresPonentes=await db.query(`SELECT tipo FROM ponentes WHERE id_ponentes=?`, eventos[i].fk_id_ponentes);
                eventos[i].ponentes=nombresPonentes[0].tipo;

                let nombresPoblacion=await db.query(`SELECT tipo FROM poblacion WHERE id_poblacion=?`, eventos[i].fk_id_poblacion);
                eventos[i].poblacion=nombresPoblacion[0].tipo;

                let nombresActividades=await db.query(`SELECT nombre FROM actividad WHERE id_actividad=?`, eventos[i].fk_id_actividad);
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
            let evento = await db.query(`SELECT * FROM evento WHERE id_evento=?`, req.params.id);
     
            let nombresDepartamentos=await db.query(`SELECT nombre FROM departamento WHERE id_departamento=?`, evento[0].fk_id_departamento);
            evento[0].departamento=nombresDepartamentos[0].nombre;

            let nombresCategoria=await db.query(`SELECT nombre FROM categoria WHERE id_categoria=?`, evento[0].fk_id_categoria);
            evento[0].categoria=nombresCategoria[0].nombre;

            
            let nombresPonentes=await db.query(`SELECT tipo FROM ponentes WHERE id_ponentes=?`, evento[0].fk_id_ponentes);
            evento[0].ponentes=nombresPonentes[0].tipo;

            let nombresPoblacion=await db.query(`SELECT tipo FROM poblacion WHERE id_poblacion=?`, evento[0].fk_id_poblacion);
            evento[0].poblacion=nombresPoblacion[0].tipo;

            let nombresActividades=await db.query(`SELECT nombre FROM actividad WHERE id_actividad=?`, evento[0].fk_id_actividad);
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
}

export const usuarioController = new UsuarioController();

