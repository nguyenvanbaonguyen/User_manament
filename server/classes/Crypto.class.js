const crypto = require("crypto");

class Crypto {}

Crypto.createPairHashToken = () => {
  const randomValue = crypto.randomBytes(32).toString("hex");
  const randomValueHashed = crypto.createHash("sha256").update(randomValue).digest("hex");
  return [randomValue, randomValueHashed];
};

Crypto.comparePairHashToken = (value, valueHashed) => {
  return valueHashed === crypto.createHash("sha256").update(value).digest("hex");
};

Crypto.hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = Crypto;
