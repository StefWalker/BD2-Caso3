const redis = require("redis");

const run = async () => {
    const redisClient = redis.createClient();
    await redisClient.connect();
    await redisClient.set("prueba", "1234d");
    const prueba = await redisClient.get("prueba");
    console.log(prueba);
}

run();