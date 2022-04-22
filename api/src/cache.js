const redis = require("redis");

const cache = redis.createClient();
cache.connect();

module.exports = cache;