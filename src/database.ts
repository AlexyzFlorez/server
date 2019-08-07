import mysql from 'promise-mysql';
import keys from "./keys";

//Conexion
const db=mysql.createPool(keys.database);
db.getConnection()
    .then(connection=>{
        db.releaseConnection(connection);
        console.log('Base de datos conectada');
    });

export default db;
