const { getColeccionBDEspacios, getDatosColeccionBDEspacios } = require("./conexion");
const cache = require("../cache");
const enviarMensaje = require("../messaging");

const llaveCacheEspacios = (pais) => `espacios/pais=${pais}`;

const actualizarEspaciosEnCache = async ({pais}) => {
    const espacios = await getDatosColeccionBDEspacios(pais, "espacios");
    cache.set(llaveCacheEspacios(pais), espacios);
    return espacios;
}

const listarEspacios = async (pais) => {
    if(!await cache.get(llaveCacheEspacios(pais))){
        return await actualizarEspaciosEnCache({pais});
    }
    return await cache.get(llaveCacheEspacios(pais));
}

const insertarEspacio = async ({
    pais,
    destino,
    nombreEmpresa,
    longitud,
    altura,
    profundidad,
    pesoMaximo,
    precioXkilo,
    fechaSalida,
    fechaLlegada,
}) => {
    (await getColeccionBDEspacios(pais, "espacios")).insert({
        origen: pais,
        destino,
        nombreEmpresa,
        longitud,
        altura,
        profundidad,
        pesoMaximo,
        precioXkilo,
        fechaSalida,
        fechaLlegada,
        fechaInsercion: new Date()
    });
    enviarMensaje({funcion: "actualizarEspaciosEnCache", pais});
}

module.exports = {
    listarEspacios,
    insertarEspacio,
    actualizarEspaciosEnCache
}