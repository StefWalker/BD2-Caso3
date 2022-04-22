const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "messaging",
    brokers: ["localhost: 9092"]
});

module.exports = kafka;