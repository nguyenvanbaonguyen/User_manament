const AppError = require("../../../../classes/AppError.class");
const petModel = require("../pet/pet.model");
const deviceModel = require("./device.model");
const FactoryCRUD = require("../../factory/FactoryCRUD");
const { asyncWrapperMiddlewareObj } = require("../../../../helpers/errorWrapper");
const deviceHistoryModel = require("../deviceHistory/deviceHistory.model");
const AdafruitAPI = require("../../services/CallDataAdafruit.service");

const createDeviceFromPet = async (req, res, next) => {
  const petID = req.params.id;
  const userID = req.user._id;
  const pet = await petModel.findById(petID);
  if (!pet) return next(new AppError("Pet with that ID is not exist", 404));

  const codes = req.body?.code.split("-");
  if (codes.length !== 3) return next(new AppError("This code is not valid", 401));
  const [type, name, createdDate] = codes;

  const device = new deviceModel({ type, name, createdDate, petID, userID });
  const savedDevice = await device.save();
  res.status(201).json({
    status: "success",
    data: savedDevice,
  });
};

const deviceFactory = new FactoryCRUD(deviceModel);

const getDevice = deviceFactory.getOne();

const getDevicesFromPet = deviceFactory.getAll({ base: "petID", query: { status: "activate" } });

const getDevices = deviceFactory.getAll();

const deleteDevice = deviceFactory.deleteOne();

const updateDevice = deviceFactory.updateOne({ bans: ["petID", "userID", "status"] });

const allowDeviceHost = deviceFactory.allowCorrectHost();

const changeStatusDevice = (status) => async (req, res, next) => {
  const id = req.params?.id;
  const device = await deviceModel.findByIdAndUpdate(id, { status });
  if (!device) return next(new AppError("Device with that ID is not exist", 404));
  res.status(204).json({
    status: "success",
  });
};

const deactiveDevice = changeStatusDevice("deactivate");

const activeDevice = changeStatusDevice("activate");

const sendAmountFood = async (req, res, next) => {
  const deviceID = req.params.id;
  const { amount } = req.body;
  if (!amount) return next(new AppError("Pls provide amount food", 401));
  await AdafruitAPI.sendAmountFood({ value: amount });
  const newDeviceHistory = new deviceHistoryModel({ type: "food", amount, deviceID });
  await newDeviceHistory.save();
  res.status(201).json({
    status: "success",
  });
};

const getAmountFoodInPlate = async (req, res, next) => {
  const data = await AdafruitAPI.getCurrentAmountInPlate();
  const realData = data.data[0];
  res.status(200).json({
    status: "success",
    data: realData,
  });
};

const allFns = {
  getDevicesFromPet,
  getDevice,
  createDeviceFromPet,
  getDevices,
  deleteDevice,
  updateDevice,
  allowDeviceHost,
  deactiveDevice,
  activeDevice,
  sendAmountFood,
  getAmountFoodInPlate,
};
asyncWrapperMiddlewareObj(allFns);
module.exports = { ...allFns };
