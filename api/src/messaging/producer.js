const kafka = require("./kafka");

const producer = kafka.producer();
producer.connect();

const enviarMensaje = (message) => {
    producer.send({
        topic: 'messaging',
        messages: [
            {value: JSON.stringify(message)},
        ],
    });
}

module.exports = enviarMensaje;