const { MongoClient } = require("mongodb");

const conexionesEspaciosPaises = {
    "costa rica": "mongodb://25.3.49.102:27017,25.3.49.102:27018,25.3.49.102:27019,25.3.49.102:27020",
    "francia": "mongodb://25.3.49.102:27017,25.3.49.102:27018,25.3.49.102:27019,25.3.49.102:27020",
    "italia": "mongodb://25.6.180.2:27017,25.6.180.2:27018,25.6.180.2:27019,25.6.180.2:27020",
    "grecia": "mongodb://25.6.180.2:27017,25.6.180.2:27018,25.6.180.2:27019,25.6.180.2:27020"
};

const conexionOrdenesEnvio = "mongodb://25.6.180.2:27028";

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
    const docs = [];
    await (await getColeccionBDEspacios(pais, coleccion)).find().forEach(doc => {
        if((doc.pais || doc.origen) === pais) docs.push(doc);
    });
    return docs;
}

const getColeccionBDOrdenesEnvio = async (coleccion) => {
    return (await getBDOrdenesEnvio()).collection(coleccion);
}

const getDatosColeccionBDOrdenesEnvio = async (coleccion) => {
    const docs = [];
    await (await getColeccionBDOrdenesEnvio(coleccion)).find().forEach(doc => docs.push(doc));
    return docs;
}

module.exports = {
    getColeccionBDEspacios,
    getDatosColeccionBDEspacios,
    getColeccionBDOrdenesEnvio,
    getDatosColeccionBDOrdenesEnvio
};
