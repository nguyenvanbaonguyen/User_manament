const mongoose = require("mongoose");
const mongoConnection = require("../../databases/mongo.connection");

const DeviceScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["food", "water", "clean"],
    required: true,
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "user",
  },
  status: {
    enum: ["activate", "deactivate"],
    default: "activate",
    type: String,
  },
  petID: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "pet",
  },
  createdDate: Date,
  activeDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoConnection.model("device", DeviceScheme);
