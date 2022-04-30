const { ObjectId } = require("mongodb");
const { green, red } = require("colors");
const { getColeccionBDEspacios, getDatosColeccionBDEspacios } = require("./conexion");
const { listarEspacios } = require("./espacios");
const cache = require("../cache");
const enviarMensaje = require("../messaging");

const tomarEspacio = async ({
    idEspacio,
    peso,
    pais,
    longitud,
    altura,
    profundidad,
    nombreCliente,
    producto
}) => {
    const espacios = await listarEspacios(pais);
    const espacioAtomar = espacios.filter(esp => esp._id === idEspacio)[0];
    if(!espacioAtomar) return console.log("espacio no encontrado".red);
    if(
        espacioAtomar.longitud < longitud ||
        espacioAtomar.altura < altura ||
        espacioAtomar.profundidad < profundidad ||
        espacioAtomar.pesoMaximo < peso
    )return console.log("espacio no tomado".red);
    (await getColeccionBDEspacios(pais, "espacios")).update(
        {_id: ObjectId(idEspacio)},
        {$set: {
            longitud: espacioAtomar.longitud - longitud,
            altura: espacioAtomar.altura - altura,
            profundidad: espacioAtomar.profundidad - profundidad,
            pesoMaximo: espacioAtomar.pesoMaximo - peso
        }}
    );
    (await getColeccionBDEspacios(pais, "espaciosTomados")).insert({
        idEspacio,
        peso,
        pais,
        longitud,
        altura,
        profundidad,
        nombreCliente,
        producto,
        paqueteEnviado: false,
        fechaToma: new Date(),
        precio: espacioAtomar.precioXkilo * peso
    }).then(async resultado => {
        await actualizarEspaciosTomadosEnCache(pais);
        enviarMensaje({
            funcion: "generarOrdenEnvio",
            idEspacioTomado: resultado.insertedIds["0"],
            pais
        });
    });
    console.log("espacio tomado".green);
}

const getEspaciosTomadosAGuardar = async () => (await cache.get("espaciosTomadosAGuardar")) || [];

const guardarEspaciosTomados = async (nuevoEspacioTomado) => {
    let espaciosTomadosAGuardar = await getEspaciosTomadosAGuardar();
    await cache.set("espaciosTomadosAGuardar", espaciosTomadosAGuardar.concat(nuevoEspacioTomado));
    if(await cache.get("guardandoEspaciosTomados"))return;
    cache.set("guardandoEspaciosTomados", true);
    espaciosTomadosAGuardar = await getEspaciosTomadosAGuardar();
    while(espaciosTomadosAGuardar.length){
        await tomarEspacio(espaciosTomadosAGuardar[0]);
        cache.set("espaciosTomadosAGuardar", espaciosTomadosAGuardar.slice(1));
        espaciosTomadosAGuardar = await getEspaciosTomadosAGuardar();
    }
    cache.set("guardandoEspaciosTomados", false);
}

const insertarEspacioTomado = async (datosNuevoEspacioTomado) => {
    enviarMensaje({
        funcion: "guardarEspaciosTomados",
        ...datosNuevoEspacioTomado
    });
}

const llaveCacheEspaciosTomados = (pais) => `espaciosTomados/pais=${pais}`;

const actualizarEspaciosTomadosEnCache = async (pais) => {
    const espaciosTomados = await getDatosColeccionBDEspacios(pais, "espaciosTomados");
    cache.set(llaveCacheEspaciosTomados(pais), espaciosTomados);
    return espaciosTomados;
}

const listarEspaciosTomados = async (pais) => {
    const espaciosTomadosEnCache = await cache.get(llaveCacheEspaciosTomados(pais));
    if(espaciosTomadosEnCache) return espaciosTomadosEnCache;
    return actualizarEspaciosTomadosEnCache(pais);
}

module.exports = {
    insertarEspacioTomado,
    guardarEspaciosTomados,
    actualizarEspaciosTomadosEnCache,
    listarEspaciosTomados
}