const mongoose = require("mongoose");
const mongoConnection = require("../../databases/mongo.connection");
const Scheme = mongoose.Schema;

const HistoryUser = new Scheme({
  userID: String,
  statusCode: Number,
  method: String,
  ip: String,
  time: {
    default: Date.now(),
    type: Date,
  },
  originalUrl: String,
});

module.exports = mongoConnection.model("user-history", HistoryUser);
