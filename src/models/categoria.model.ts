import {Schema, model} from 'mongoose';

const CategoriaSchema=new Schema(
    {
        nombre:String
    }
)

export default model('categorias', CategoriaSchema)