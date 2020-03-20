import {Schema, model} from 'mongoose';

const EventoSchema=new Schema(
    {
        id_evento: String,
        id_usuario: String,
        nombre: String,
        departamento: {
            type: Schema.Types.ObjectId,
            ref: "departamentos",
            autopopulate: true
        },
        costo: String,
        tipo_actividad: {
            type: Schema.Types.ObjectId,
            ref: "actividades"
        },
        categoria: {
            type: Schema.Types.ObjectId,
            ref: "categorias",
            autopopulate: true
        },
        fecha_inicio: String,
        fecha_termino: String,
        hora_inicio: String,
        hora_termino: String,
        descripcion: String,
        ponentes: {
            type: Schema.Types.ObjectId,
            ref: "ponentes",
            autopopulate: true
        },
        poblacion: {
            type: Schema.Types.ObjectId,
            ref: "poblaciones",
            autopopulate: true
        },
        url_portada: String,
        evidencias: [
            {
                type: Schema.Types.ObjectId,
                ref: "evidencias",
                autopopulate: true
            }
        ],
        en_memoria:Boolean
    }
)

export default model('eventos', EventoSchema)