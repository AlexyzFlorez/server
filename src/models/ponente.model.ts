import {Schema, model} from 'mongoose';

const PonenteSchema=new Schema(
    {
        nombre:String
    }
)

export default model('ponentes', PonenteSchema)