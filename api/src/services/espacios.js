const { listarEspacios, insertarEspacio } = require("../models/espacios");

const servicio = {
    name: "espacios",
    actions: {
        listar: (ctx) => listarEspacios(ctx.params.pais),
        insertar: (ctx) => insertarEspacio(ctx.params)
    }
}

const rutas = {
    "GET :pais/espacios/": "espacios.listar",
    "POST :pais/espacios/": "espacios.insertar"
}

module.exports = {
    servicio,
    rutas
}