import {Schema, model} from 'mongoose';

const EventoSchema=new Schema(
    {
        id_evento: String,
        id_usuario: String,
        nombre: String,
        departamento: {
            type: Schema.Types.ObjectId,
            ref: "departamento",
            autopopulate: true
        },
        costo: String,
        tipo_actividad: {
            type: Schema.Types.ObjectId,
            ref: "actividad",
            autopopulate: true
        },
        categoria: {
            type: Schema.Types.ObjectId,
            ref: "categoria",
            autopopulate: true
        },
        fecha_inicio: String,
        fecha_termino: String,
        hora_inicio: String,
        hora_termino: String,
        descripcion: String,
        ponentes: {
            type: Schema.Types.ObjectId,
            ref: "ponente",
            autopopulate: true
        },
        poblacion: {
            type: Schema.Types.ObjectId,
            ref: "poblacion",
            autopopulate: true
        },
        url_portada: String,
        evidencias: [
            {
                type: Schema.Types.ObjectId,
                ref: "evidencia",
                autopopulate: true
            }
        ],
        en_memoria:Boolean
    }
)

export default model('evento', EventoSchema)