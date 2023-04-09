const FactoryCRUD = require("../../factory/FactoryCRUD");
const { asyncWrapperMiddlewareObj } = require("../../../../helpers/errorWrapper");
const UserModel = require("./user.model");

const getMe = async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: req.user,
  });
};

const userFactory = new FactoryCRUD(UserModel);

const getUser = userFactory.getOne();

const getUsers = userFactory.getAll();

const deleteUser = userFactory.deleteOne();

const updateMe = userFactory.updateOne({ bans: ["password", "role"] });

const allFns = { getMe, updateMe, getUser, deleteUser, getUsers };
asyncWrapperMiddlewareObj(allFns);
module.exports = { ...allFns };
