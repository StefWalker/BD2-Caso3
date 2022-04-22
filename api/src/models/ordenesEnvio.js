const { getColeccionBDOrdenesEnvio, getDatosColeccionOrdenesEnvio } = require("./conexion");
const cache = require("../cache");
const enviarMensaje = require("../messaging");

const actualizarOrdenesEnvioEnCache = async () => {
    const ordenesEnvio = await getDatosColeccionOrdenesEnvio("ordenesEnvio");
    cache.set("ordenesEnvio", ordenesEnvio);
    return ordenesEnvio;
}

const obtenerOrdenesEnvio = async () => {
    return (await cache.get("ordenesEnvio")) || (await actualizarOrdenesEnvioEnCache());
}

const listarOrdenesEnvioCliente = async ({nombreCliente}) => {
    const ordenesEnvio = await obtenerOrdenesEnvio();
    return ordenesEnvio.filter(oe = oe.nombreCliente === nombreCliente);
}

const actualizarUbicacionOrdenEnvio = async ({idOrdenEnvio, pais}) => {
    (await getColeccionBDOrdenesEnvio("ordenesEnvio")).update(
        {_id: idOrdenEnvio},
        {pais}
    );
    enviarMensaje({funcion: "actualizarOrdenesEnvioEnCache"});
}

const obtenerOrdenEnvio = async ({idOrdenEnvio}) => {
    const ordenesEnvio = await obtenerOrdenesEnvio();
    return ordenesEnvio.filter(oe => oe._id === idOrdenEnvio)[0];
}

module.exports = {
    listarOrdenesEnvioCliente,
    actualizarOrdenesEnvioEnCache,
    actualizarUbicacionOrdenEnvio,
    obtenerOrdenEnvio
}
