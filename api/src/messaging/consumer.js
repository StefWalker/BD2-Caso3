const kafka = require("./kafka");
const { actualizarEspaciosEnCache } = require("../models/espacios");
const { actualizarOrdenesEnvioEnCache } = require("../models/ordenesEnvio");

const acciones = {
    actualizarEspaciosEnCache,
    actualizarOrdenesEnvioEnCache
}

const ejecutarConsumidor = async () => {
    const consumer = kafka.consumer({groupId: "messaging-group"});
    await consumer.connect();
    await consumer.subscribe({topic: "messaging"});
    await consumer.run({
        eachMessage: ({message}) => {
            const mensaje = JSON.parse(message.value.toString());
            acciones[mensaje.funcion](mensaje);
        }
    });
}

ejecutarConsumidor();