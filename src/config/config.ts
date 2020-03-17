if (process.env.NODE_ENV !== "production") {
    require('dotenv').config(); //Este metodo cargara las variables de entorno del archivo .env
}

module.exports = {
    PORT: process.env.PORT,
    URI_API: process.env.URI_API,
    MONGO_URI: process.env.MONGO_URI,
    SEED: process.env.SEED,
    TIPO_EDITOR: process.env.TIPO_EDITOR,
    TIPO_ADMINISTRADOR: process.env.TIPO_ADMINISTRADOR,
};
