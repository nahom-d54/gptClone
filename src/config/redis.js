const { default: Redis } = require("ioredis");

const initializeRedis = async () => {
  const client = new Redis(process.env.REDIS_URL);
  return client;
};

module.exports = initializeRedis;
