import {Schema, model} from 'mongoose';

const ActividadSchema=new Schema(
    {
        id_actividad:String,
        nombre:String
    }
)

export default model('actividades', ActividadSchema);