const { asyncWrapperConsole } = require("../../../helpers/errorWrapper");
const Redis = require("../databases/redis.connection");
const redis = new Redis();
const client = redis.client;
const whiteListKeys = ["client"];

redis.set = async (key, value, expire, isNX) => {
  expire = expire === -1 ? undefined : expire;
  await client.set(key, value, { EX: expire, NX: isNX });
};

redis.get = async (key) => {
  return await client.get(key);
};

redis.del = async (key) => {
  return await client.del([key]);
};

redis.ttl = async (key) => {
  return await client.ttl(key);
};

redis.exists = async (key) => {
  await client.exists(key);
};

redis.inc = async (key, value) => {
  return await client.incrBy(key, value);
};

redis.dec = async (key, value) => {
  return await client.decrBy(key, value);
};

Object.keys(redis)
  .filter((key) => !whiteListKeys.includes(key))
  .forEach((nameFn) => {
    redis[nameFn] = asyncWrapperConsole(redis[nameFn]);
  });

module.exports = redis;
