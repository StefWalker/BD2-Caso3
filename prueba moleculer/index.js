let { ServiceBroker } = require("moleculer");
let HttpServer = require("moleculer-web");

let broker = new ServiceBroker();

broker.createService({
    mixins: [HttpServer],
    settings: {
        routes: [{
            aliases: {
                "GET /prueba": "test.hello",
                "GET /hello": "prueba.hello"
            }
        }]
    }
});

broker.createService({
    name: "test",
    actions: {
        hello() {
            return {mensaje: "Hello API Gateway!"};
        }
    }
});

broker.createService({
    name: "prueba",
    actions: {
        hello() {
            return {mensaje: "Mensaje de prueba"};
        }
    }
});

broker.start();