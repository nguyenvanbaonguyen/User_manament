const AppError = require("../../../../classes/AppError.class");
const FactoryCRUD = require("../../factory/FactoryCRUD");
const { asyncWrapperMiddlewareObj } = require("../../../../helpers/errorWrapper");
const { getLocalsRes } = require("../../../../helpers/localsRes");
const HistoryUserModel = require("../historyUser/historyUser.model");
const UserModel = require("./user.model");
const APIFeatures = require("../../../../classes/APIFeature.class");
const handleData = require("../../../../helpers/handleData");

const getMe = async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: req.user,
  });
};

const updateMe = async (req, res, next) => {
  let { data, avatar } = req.body;
  if (!data) data = {};
  data = JSON.parse(data);
  if (avatar) data.avatar = avatar;
  const validatedData = handleData(data, { bans: ["password", "role"] });
  console.log(validatedData);
  const user = req.user;
  const newUser = await UserModel.findByIdAndUpdate(user._id, validatedData, { new: true });

  res.status(200).json({
    status: "success",
    data: newUser,
  });
};

const userFactory = new FactoryCRUD(UserModel, { select: "-password -logoutTime" });

const getUser = userFactory.getOne;

const getUsers = userFactory.getAll;

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.findByIdAndDelete(id);
  if (!user) return next(new AppError(`ID ${id} is not exists`, 400));

  res.status(204).json({
    status: "success",
    data: null,
  });
};

const uploadAvatar = async (req, res, next) => {
  let { avatar } = req.body;
  const user = req.user;
  const newUser = await UserModel.findByIdAndUpdate(user._id, { avatar }, { new: true });

  res.status(200).json({
    status: "success",
    data: newUser,
  });
};

const getUserHistory = async (req, res, next) => {
  const id = req.params?.id || req.user._id;
  const histories = await new APIFeatures(UserModel.findBaseScheme(HistoryUserModel, id)).all().query;
  const totalItems = await UserModel.findBaseScheme(HistoryUserModel, id).count();
  res.status(200).json({
    status: "success",
    data: {
      data: histories,
      totalItems,
    },
  });
};

const allFns = { getMe, updateMe, getUser, deleteUser, getUserHistory, getUsers, uploadAvatar };
asyncWrapperMiddlewareObj(allFns);
module.exports = { ...allFns };
