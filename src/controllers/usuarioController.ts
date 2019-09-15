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
}

export const usuarioController = new UsuarioController();

