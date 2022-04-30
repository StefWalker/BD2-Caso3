const {
    listarOrdenesEnvioCliente,
    obtenerOrdenEnvio,
    actualizarUbicacionOrdenEnvio
} = require("../models/ordenesEnvio");

const servicio = {
    name: "ordenesEnvio",
    actions: {
        listarCliente: (ctx) => listarOrdenesEnvioCliente(ctx.params),
        obtener: (ctx) => obtenerOrdenEnvio(ctx.params),
        actualizarUbicacion: (ctx) => actualizarUbicacionOrdenEnvio(ctx.params)
    }
}

const rutas = {
    "GET /ordenes-envio/clientes/:nombreCliente": "ordenesEnvio.listarCliente",
    "GET /ordenes-envio/:idOrdenEnvio": "ordenesEnvio.obtener",
    "PUT /ordenes-envio": "ordenesEnvio.actualizarUbicacion"
}

module.exports = {
    servicio,
    rutas
}