import {Schema, model} from 'mongoose';

const ActividadSchema=new Schema(
    {
        nombre:String
    }
)

export default model('actividades', ActividadSchema);