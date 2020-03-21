import {Schema, model} from 'mongoose';

const UsuarioSchema=new Schema(
    {
        nombre: String,
        apellido_paterno: String,
        apellido_materno: String,
        telefono: String,
        num_empleado: String,
        departamento: {
            type: Schema.Types.ObjectId,
            ref: "departamentos",
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
                ref: "eventos",
                autopopulate: true
            }
        ]
    }
)

export default model('usuarios', UsuarioSchema)