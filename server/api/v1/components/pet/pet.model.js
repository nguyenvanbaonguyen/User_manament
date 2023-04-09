const mongoose = require("mongoose");
const mongoConnection = require("../../databases/mongo.connection");

const PetScheme = new mongoose.Schema({
  name: {
    type: String,
    default: "noname",
  },
  avatar: {
    type: mongoose.Schema.ObjectId,
    ref: "image",
  },
  type: {
    type: String,
    default: "animal",
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
});

PetScheme.pre(/^find/, function (next) {
  this.populate("avatar").populate("userID");
  next();
});

module.exports = mongoConnection.model("pet", PetScheme);
