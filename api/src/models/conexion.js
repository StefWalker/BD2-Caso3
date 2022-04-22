const { MongoClient } = require("mongodb");

const conexionesEspaciosPaises = {
    "costa rica": "mongodb://localhost:27017",
    "france": "mongodb://localhost:27019,localhost:27020"
};

const conexionOrdenesEnvio = "mongodb://localhost:27021,localhost:27022";

class ConexionBaseDatos {
    static instanciasEspaciosPaises = {
        "costa rica": null,
        "france": null
    };

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

const getDatosColeccionEspacios = async (pais, coleccion) => {
    const datos = [];
    await (await getColeccionBDEspacios(pais, coleccion)).find().forEach(
        dato => datos.push(dato)
    );
    return datos;
}

const getColeccionBDOrdenesEnvio = async (coleccion) => {
    return (await getBDOrdenesEnvio()).coleccion(coleccion);
}

const getDatosColeccionOrdenesEnvio = async (coleccion) => {
    const datos = [];
    await (await getColeccionBDOrdenesEnvio(coleccion)).find().forEach(dato => datos.push(dato));
    return datos;
}

module.exports = {
    getColeccionBDEspacios,
    getDatosColeccionEspacios,
    getColeccionBDOrdenesEnvio,
    getDatosColeccionOrdenesEnvio
};