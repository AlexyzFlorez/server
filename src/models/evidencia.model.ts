import {Schema, model} from 'mongoose';

const EvidenciaSchema=new Schema(
    {
        url_evidencia: String,
        descripcion: String
    }
)

export default model('evidencias', EvidenciaSchema)