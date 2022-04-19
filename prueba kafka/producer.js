const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "my-producer",
    brokers: ["localhost: 9092"]
});

const producer = kafka.producer();


const run = async () => {
    await producer.connect();
    await producer.send({
        topic: 'test-topic',
        messages: [
            { value: 'Hello KafkaJS user!' },
        ],
    });
}

run();