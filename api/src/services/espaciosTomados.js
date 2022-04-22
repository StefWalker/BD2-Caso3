const { insertarEspacioTomado } = require("../models/espaciosTomados");

const servicio = {
    name: "espaciosTomados",
    actions: {
        insertar: (ctx) => insertarEspacioTomado(ctx.params)
    }
}

const rutas = {
    "POST :pais/espacios/tomados": "espaciosTomados.insertar"
}

module.exports = {
    servicio,
    rutas
}