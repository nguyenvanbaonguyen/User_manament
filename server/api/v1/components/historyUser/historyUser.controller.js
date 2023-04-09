const { asyncWrapperMiddlewareObj } = require("../../../../helpers/errorWrapper");
const FactoryCRUD = require("../../factory/FactoryCRUD");
const HistoryUserModel = require("./historyUser.model");

const saveHistoryUser = async (req, res, next) => {
  res.on("finish", async () => {
    if (!req.user) return;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;
    const userID = req.user._id;
    await HistoryUserModel.create({ method, originalUrl, ip, statusCode, userID });
  });
  next();
};

const userFactory = new FactoryCRUD(HistoryUserModel);

const getUserHistory = userFactory.getAll({ userID: "userI" });

const allFns = { saveHistoryUser, getUserHistory };
asyncWrapperMiddlewareObj(allFns);
module.exports = allFns;
