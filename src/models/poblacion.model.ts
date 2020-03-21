import {Schema, model} from 'mongoose';

const PoblacionSchema=new Schema(
    {
        nombre:String
    }
)

export default model('poblaciones', PoblacionSchema)