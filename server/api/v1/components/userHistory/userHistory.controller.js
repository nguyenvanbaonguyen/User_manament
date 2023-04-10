const { asyncWrapperMiddlewareObj } = require("../../../../helpers/errorWrapper");
const FactoryCRUD = require("../../factory/FactoryCRUD");
const HistoryUserModel = require("./userHistory.model");

const saveUserHistory = (action) => async (req, res, next) => {
  try {
    res.on("finish", async () => {
      if (!req.user) return;
      const { ip } = req;
      const { statusCode } = res;
      const userID = req.user._id;
      await HistoryUserModel.create({ action, ip, statusCode, userID });
    });
    next();
  } catch (err) {
    next(err);
  }
};

const userFactory = new FactoryCRUD(HistoryUserModel);

const getUserHistory = userFactory.getAll({ base: "userID" });

const allFns = { getUserHistory };
asyncWrapperMiddlewareObj(allFns);
module.exports = { ...allFns, saveUserHistory };
