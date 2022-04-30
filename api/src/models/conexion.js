const { MongoClient } = require("mongodb");

const conexionesEspaciosPaises = {
    "costa rica": "mongodb://localhost:27017,localhost:27018",
    "francia": "mongodb://25.76.230.45:27017,25.76.230.45:27018"
};

const conexionOrdenesEnvio = "mongodb://localhost:27018";

class ConexionBaseDatos {
    static instanciasEspaciosPaises = {};

    static instanciaOrdenesEnvio = null;
}

const getBDEspaciosPais = (pais) => {
    if(!pais) return;
    return new Promise((resolve, reject) => {
        const instanciaBD = ConexionBaseDatos.instanciasEspaciosPaises[pais];
        if(instanciaBD){
            return resolve(instanciaBD);
        }
        const conexion = new MongoClient(conexionesEspaciosPaises[pais]);
        conexion.connect().then(() => {
            const bd = conexion.db("ubertainer");
            ConexionBaseDatos.instanciasEspaciosPaises[pais] = bd;
            return resolve(bd);
        });
    });
}

const getBDOrdenesEnvio = () => {
    return new Promise((resolve, reject) => {
        const instanciaBD = ConexionBaseDatos.instanciaOrdenesEnvio;
        if(instanciaBD){
            return resolve(instanciaBD);
        }
        const conexion = new MongoClient(conexionOrdenesEnvio);
        conexion.connect().then(() => {
            const bd = conexion.db("ubertainer");
            ConexionBaseDatos.instanciaOrdenesEnvio = bd;
            return resolve(bd);
        });
    });
}

const getColeccionBDEspacios = async (pais, coleccion) => {
    return (await getBDEspaciosPais(pais)).collection(coleccion);
}

const getDatosColeccionBDEspacios = async (pais, coleccion) => {
    const datos = [];
    await (await getColeccionBDEspacios(pais, coleccion)).find().forEach(
        dato => datos.push(dato)
    );
    return datos;
}

const getColeccionBDOrdenesEnvio = async (coleccion) => {
    return (await getBDOrdenesEnvio()).collection(coleccion);
}

const getDatosColeccionBDOrdenesEnvio = async (coleccion) => {
    const datos = [];
    await (await getColeccionBDOrdenesEnvio(coleccion)).find().forEach(dato => datos.push(dato));
    return datos;
}

module.exports = {
    getColeccionBDEspacios,
    getDatosColeccionBDEspacios,
    getColeccionBDOrdenesEnvio,
    getDatosColeccionBDOrdenesEnvio
};