const { getColeccionBDOrdenesEnvio, getDatosColeccionOrdenesEnvio } = require("./conexion");
const cache = require("../cache");
const enviarMensaje = require("../messaging");

const actualizarOrdenesEnvioEnCache = async () => {
    const ordenesEnvio = await getDatosColeccionOrdenesEnvio("ordenesEnvio");
    cache.set("ordenesEnvio", ordenesEnvio);
    return ordenesEnvio;
}

const listarOrdenesEnvioCliente = async (nombreCliente) => {
    const ordenesEnvio = (await cache.get("ordenesEnvio")) || (await actualizarOrdenesEnvioEnCache());
    return ordenesEnvio.filter(oe = oe.nombreCliente === nombreCliente);
}

const actualizarUbicacionOrdenEnvio = async ({idOrdenEnvio, pais}) => {
    (await getColeccionBDOrdenesEnvio("ordenesEnvio")).update(
        {_id: idOrdenEnvio},
        {pais}
    );
    enviarMensaje({funcion: "actualizarOrdenesEnvioEnCache"});
}

module.exports = {
    listarOrdenesEnvioCliente,
    actualizarOrdenesEnvioEnCache,
    actualizarUbicacionOrdenEnvio
}