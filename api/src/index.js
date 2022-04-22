let { ServiceBroker } = require("moleculer");
let HttpServer = require("moleculer-web");
require("./messaging/consumer");
const espacios = require("./services/espacios");
const espaciosTomados = require("./services/espaciosTomados");
const ordenesEnvio = require("./services/ordenesEnvio");

let broker = new ServiceBroker();

broker.createService({
    mixins: [HttpServer],
    settings: {
        routes: [{
            path: "api",
            aliases: {
                ...espacios.rutas,
                ...espaciosTomados.rutas,
                ...ordenesEnvio.rutas
            }
        }]
    }
});

broker.createService(espacios.servicio);
broker.createService(espaciosTomados.servicio);
broker.createService(ordenesEnvio.servicio);

broker.start();