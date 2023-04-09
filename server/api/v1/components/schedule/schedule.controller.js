const AppError = require("../../../../classes/AppError.class");
const { asyncWrapperMiddlewareObj } = require("../../../../helpers/errorWrapper");
const FactoryCRUD = require("../../factory/FactoryCRUD");
const scheduleModel = require("./schedule.model");

const createScheduleFromDevice = async (req, res, next) => {
  const deviceID = req.params.id;
  req.body.deviceID = deviceID;
  req.body.userID = req.user._id;
  const { time } = req.body;
  if (time && time < Date.now()) return next(new AppError("Your time is not valid", 400));
  const schedule = new scheduleModel(req.body);
  await schedule.save();
  res.status(201).json({
    status: "success",
  });
};

const scheduleFactory = new FactoryCRUD(scheduleModel);

const getSchedulesFromDevice = scheduleFactory.getAll({ base: "deviceID" });

const deleteSchedule = scheduleFactory.deleteOne();

const allowScheduleHost = scheduleFactory.allowCorrectHost();

const getAllSchedulesNeedToDo = async () => {
  const timeNow = new Date();
  const hour = `${timeNow.getHours()}:${timeNow.getMinutes()}`;
  const weekday = timeNow.getDay();
  const validSchedules = await scheduleModel.find({ $or: [{ hour, weekday }, { time: { $lte: timeNow } }] });
  return validSchedules;
};

const allFns = {
  getSchedulesFromDevice,
  createScheduleFromDevice,
  deleteSchedule,
  allowScheduleHost,
};
asyncWrapperMiddlewareObj(allFns);
module.exports = { ...allFns, getAllSchedulesNeedToDo };
