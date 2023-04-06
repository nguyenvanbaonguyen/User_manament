const mongoose = require("mongoose");
const mongoConnection = require("../../databases/mongo.connection");
const bcrypt = require("bcrypt");
const HistoryUserModel = require("../historyUser/historyUser.model");
const FactoryRelation = require("../../factory/FactoryRelation");
const regexAll = require("../../../../helpers/regex");

const Scheme = mongoose.Schema;

const User = new Scheme(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: (v) => {
          return regexAll.email.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v) => {
          return regexAll.phone.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    role: {
      default: "user",
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: mongoose.Schema.ObjectId,
      ref: "image",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const UserDecorator = new FactoryRelation(User);

UserDecorator.createRelation(HistoryUserModel, {
  ref: "user-history",
  foreignField: "userId",
  localField: "_id",
})
  .setPopulate()
  .setDeleteCascade();

User.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

User.pre(/^find/, function (next) {
  this.select("-password -timeLogout").populate("avatar");
  next();
});

User.pre(/^findOneAndUpdate/, async function (next) {
  if (!this._update?.password) return next();
  this._update.password = await bcrypt.hash(this._update.password, 12);
  next();
});

module.exports = mongoConnection.model("user", User);
