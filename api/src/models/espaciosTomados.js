const { getColeccionBDEspacios, getDatosColeccionEspacios } = require("./conexion");

const insertarEspacioTomado = async ({
    idEspacio,
    peso,
    pais,
    longitud,
    altura,
    profundidad,
    nombreCliente,
    producto
}) => {
    (await getColeccionBDEspacios(pais, "espaciosTomados")).insert({
        idEspacio,
        peso,
        pais,
        longitud,
        altura,
        profundidad,
        nombreCliente,
        producto,
        fechaInsercion: new Date()
    });
}

module.exports = {
    insertarEspacioTomado
}