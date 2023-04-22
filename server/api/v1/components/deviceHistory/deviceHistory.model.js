const mongoose = require("mongoose");
const mongoConnection = require("../../databases/mongo.connection");

const deviceHistory = new mongoose.Schema({
  type: {
    type: String,
    enum: ["food", "water", "clean"],
  },
  amount: {
    type: Number,
    required: true,
  },
  deviceID: {
    type: String,
    required: true,
  },
  time: {
    default: Date.now(),
    type: Date,
  },
});

module.exports = mongoConnection.model("device-history", deviceHistory);
