const { asyncWrapperMiddlewareObj } = require("../../../../helpers/errorWrapper");
const { getLocalsRes } = require("../../../../helpers/localsRes");
const HistoryUserModel = require("./historyUser.model");

const saveHistoryUser = async (req, res, next) => {
  res.on("finish", async () => {
    if (!req.user) return;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;
    const userId = req.user._id;
    await HistoryUserModel.create({ method, originalUrl, ip, statusCode, userId });
  });
  next();
};

const getHistoryFromUser = async (req, res, next) => {
  let { id: userId } = req.params;
  if (!userId) userId = getLocalsRes("user", res)?._id;
  const userHistories = await HistoryUserModel.find({ userId });
  res.status(200).json({
    status: "success",
    data: userHistories,
  });
};

const allFns = { saveHistoryUser, getHistoryFromUser };
asyncWrapperMiddlewareObj(allFns);
module.exports = allFns;
