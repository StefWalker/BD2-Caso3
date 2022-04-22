const { getColeccionBDEspacios, getDatosColeccionEspacios } = require("./conexion");
const cache = require("../cache");
const enviarMensaje = require("../messaging");

const actualizarEspaciosEnCache = async ({pais}) => {
    const espacios = await getDatosColeccionEspacios(pais, "espacios");
    cache.set("espacios", JSON.stringify(espacios));
    return espacios;
}

const listarEspacios = async (pais) => {
    if(!await cache.get("espacios")){
        return await actualizarEspaciosEnCache({pais});
    }else{
        return JSON.parse(await cache.get("espacios"));
    }
}

const insertarEspacio = async ({
    pais,
    destino,
    nombreEmpresa,
    longitud,
    altura,
    profundidad,
    precioMaximo,
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
        precioMaximo,
        precioXkilo,
        fechaInsercion,
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