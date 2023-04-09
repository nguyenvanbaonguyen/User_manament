const { asyncWrapperMiddlewareObj } = require("../../../../helpers/errorWrapper");
const FactoryCRUD = require("../../factory/FactoryCRUD");
const deviceModel = require("../device/device.model");
const deviceHistoryModel = require("./deviceHistory.model");

const deviceHistoryFactory = new FactoryCRUD(deviceHistoryModel);

const getAllDeviceHistories = deviceHistoryFactory.getAll({ base: "deviceID" });

const allFns = { getAllDeviceHistories };
asyncWrapperMiddlewareObj(allFns);
module.exports = allFns;
