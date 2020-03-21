import {Schema, model} from 'mongoose';

const DepartamentoSchema=new Schema(
    {
        nombre:String
    }
)

export default model('departamentos', DepartamentoSchema)