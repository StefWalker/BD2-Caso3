const { listarOrdenesEnvioCliente, actualizarUbicacionOrdenEnvio } = require("../models/ordenesEnvio");

const servicio = {
    name: "ordenesEnvio",
    actions: {
        listar: (ctx) => listarOrdenesEnvioCliente(ctx.params),
        actualizarUbicacion: (ctx) => actualizarUbicacionOrdenEnvio(ctx.params)
    }
}

const rutas = {
    "GET /ordenes-envio": "ordenesEnvio.listar",
    "PUT /ordenes-envio": "ordenesEnvio.actualizarUbicaciones"
}

module.exports = {
    servicio,
    rutas
}