const kafka = require("./kafka");

const producer = kafka.producer();
producer.connect();

const enviarMensaje = (contenidoMensaje) => {
    producer.send({
        topic: 'messaging',
        messages: Array.isArray(contenidoMensaje) ?
            contenidoMensaje.map(mensaje => ({value: JSON.stringify(mensaje)}))
        :  
            [{value: JSON.stringify(contenidoMensaje)}]
        ,
    });
}

module.exports = enviarMensaje;