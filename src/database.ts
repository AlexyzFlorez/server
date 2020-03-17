import mongoose from 'mongoose';
const config = require('./config/config');

async function connect() {
    try {
        await mongoose.connect(config.MONGO_URI, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        console.log("Base de datos conectada")
    } catch{
        console.log("Error al conectar la base de datos")
    }
}

export default connect;


