import {Schema, model} from 'mongoose';

const PoblacionSchema=new Schema(
    {
        id_poblacion:String,
        nombre:String
    }
)

export default model('poblaciones', PoblacionSchema)