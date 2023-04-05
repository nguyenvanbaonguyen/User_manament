const { createClient } = require("redis");
const { REDIS_HOST } = require("../../../config");
const REDIS_URL = `redis://${REDIS_HOST}:6379`;

class Redis {
  constructor() {
    if (Redis.instance) return Redis.instance;
    Redis.instance = this;
    this.client = createClient({ url: REDIS_URL });
    this.createConnection();
    this.client.on("connect", () => {
      console.log(`Redis connect with ${REDIS_HOST}`);
    });
    this.client.on("error", (err) => {
      console.log(err);
    });
  }
  async createConnection() {
    await this.client.connect();
  }
}

module.exports = Redis;
