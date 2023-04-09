const mongoose = require("mongoose");
const mongoConnection = require("../../databases/mongo.connection");

const ScheduleScheme = new mongoose.Schema({
  type: {
    type: String,
    required: String,
    enum: ["once", "again"],
  },
  weekday: {
    type: Number,
    required: function () {
      return this.type === "again";
    },
  },
  hour: {
    type: String,
    required: function () {
      return this.type === "again";
    },
  },
  time: {
    type: Number,
    required: function () {
      return this.type === "once";
    },
  },
  amount: {
    type: Number,
    required: true,
  },
  deviceID: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
});

module.exports = mongoConnection.model("schedule", ScheduleScheme);
