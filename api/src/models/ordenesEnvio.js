const { ObjectId } = require("mongodb");
const { green, red } = require("colors");
const {
    getColeccionBDOrdenesEnvio,
    getDatosColeccionBDOrdenesEnvio,
    getColeccionBDEspacios
} = require("./conexion");
const cache = require("../cache");
const enviarMensaje = require("../messaging");
const { actualizarEspaciosTomadosEnCache, listarEspaciosTomados } = require("./espaciosTomados");

const actualizarOrdenesEnvioEnCache = async () => {
    const ordenesEnvio = await getDatosColeccionBDOrdenesEnvio("ordenesEnvio");
    cache.set("ordenesEnvio", ordenesEnvio);
    return ordenesEnvio;
}

const listarOrdenesEnvio = async () => {
    if(!await cache.get("ordenesEnvio")){
        return await actualizarOrdenesEnvioEnCache();
    }
    return await cache.get("ordenesEnvio");
}

const listarOrdenesEnvioCliente = async ({nombreCliente}) => {
    const ordenesEnvio = await listarOrdenesEnvio();
    return ordenesEnvio.filter(oe => oe.nombreCliente === nombreCliente);
}

const actualizarUbicacionOrdenEnvio = async ({idOrdenEnvio, pais}) => {
    (await getColeccionBDOrdenesEnvio("ordenesEnvio")).update(
        {_id: ObjectId(idOrdenEnvio)},
        {$set: {ubicacion: pais}}
    );
    enviarMensaje({funcion: "actualizarOrdenesEnvioEnCache"});
}

const obtenerOrdenEnvio = async ({idOrdenEnvio}) => {
    const ordenesEnvio = await listarOrdenesEnvio();
    return ordenesEnvio.filter(oe => oe._id === idOrdenEnvio)[0];
}

const generarOrdenEnvio = async ({ idEspacioTomado, pais }) => {
    const espaciosTomados = await listarEspaciosTomados(pais);
    const espacioTomado = espaciosTomados.filter(et => et._id === idEspacioTomado)[0];
    if(!espacioTomado) return console.log("espacio tomado no encontrado".red);
    (await getColeccionBDEspacios(pais, "espaciosTomados")).update(
        {_id: ObjectId(idEspacioTomado)},
        {$set: {paqueteEnviado: true}}
    );
    actualizarEspaciosTomadosEnCache(pais);
    delete espacioTomado._id;
    delete espacioTomado.paqueteEnviado;
    (await getColeccionBDOrdenesEnvio("ordenesEnvio")).insert({
        ...espacioTomado,
        idEspacioTomado,
        ubicacion: pais,
        fechaEnvio: new Date()
    });
    console.log("orden envío generada".green);
    actualizarOrdenesEnvioEnCache();
}

module.exports = {
    listarOrdenesEnvioCliente,
    actualizarOrdenesEnvioEnCache,
    actualizarUbicacionOrdenEnvio,
    obtenerOrdenEnvio,
    generarOrdenEnvio
}