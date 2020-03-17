import {Schema, model} from 'mongoose';

const DepartamentoSchema=new Schema(
    {
        id_departamento:String,
        nombre:String
    }
)

export default model('departamento', DepartamentoSchema)