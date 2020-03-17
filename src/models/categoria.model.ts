import {Schema, model} from 'mongoose';

const CategoriaSchema=new Schema(
    {
        id_categoria:String,
        nombre:String
    }
)

export default model('categoria', CategoriaSchema)