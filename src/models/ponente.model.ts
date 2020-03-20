import {Schema, model} from 'mongoose';

const PonenteSchema=new Schema(
    {
        id_ponentes:String,
        nombre:String
    }
)

export default model('ponentes', PonenteSchema)