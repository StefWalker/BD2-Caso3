const redis = require("redis");
const fs = require("fs");

const servidoresRedis = ["127.0.0.1:6379", "127.0.0.1:6380", "127.0.0.1:6381"];

const conexionesRedis = [];

const agregarAarchivo = (mensaje) => {
    const nombreArchivo = "./src/cache/logs.log";
    fs.readFile(nombreArchivo, "utf8", (error, datos) => {
        if((datos || "").split("\n").length >= 1000) fs.writeFile(nombreArchivo, "", () => {});
    });
    fs.appendFile(nombreArchivo, `${mensaje}\n`, () => {});
}

const generarConexiones = () => {
    servidoresRedis.forEach((servidor, index) => {
        const cliente = redis.createClient({url: `redis://${servidor}`});
        cliente.on("error", () => {
            agregarAarchivo(`Servidor redis ${servidor} caído`);
            conexionesRedis[index] = null;
        });
        cliente.on("connect", () => {
            agregarAarchivo(`Servidor redis ${servidor} conectado`);
            cliente.set("guardandoEspaciosTomados", false);
            conexionesRedis[index] = cliente;
        });
        cliente.connect();
    });
}

generarConexiones();

const obtenerConexionRedis = () => {
    for(const conexion of conexionesRedis) if(conexion) return conexion;
}

const set = (llave, valor) => obtenerConexionRedis().set(llave, JSON.stringify(valor));

const get = async (llave) => JSON.parse(await obtenerConexionRedis().get(llave));

module.exports = {
    set,
    get
}