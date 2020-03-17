import {Schema, model} from 'mongoose';

const UsuarioSchema=new Schema(
    {
        id_usuario: String,
        nombre: String,
        apellido_paterno: String,
        apellido_materno: String,
        telefono: String,
        num_empleado: String,
        departamento: {
            type: Schema.Types.ObjectId,
            ref: "departamento",
            autopopulate: true
        },
        correo: String,
        password: String,
        tipo_usuario: String,
        estado_registro: String,
        codigo_res_password: String,
        eventos: [
            {
                type: Schema.Types.ObjectId,
                ref: "evento",
                autopopulate: true
            }
        ]
    }
)

export default model('usuario', UsuarioSchema)