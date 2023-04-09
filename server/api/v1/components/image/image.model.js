const { default: mongoose } = require("mongoose");
const mongoConnection = require("../../databases/mongo.connection");

const imageScheme = new mongoose.Schema({
  url: String,
  type: {
    type: String,
    default: "public",
  },
  userID: String,
});

module.exports = mongoConnection.model("image", imageScheme);
