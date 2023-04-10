const { authUser } = require("../auth/auth.controller");
const { deleteSchedule, getAllSchedulesNeedToDo, allowScheduleHost } = require("./schedule.controller");
const scheduleModel = require("./schedule.model");
const deviceHistoryModel = require("../deviceHistory/deviceHistory.model");
const AdafruitAPI = require("../../services/CallDataAdafruit.service");

const scheduleRoute = require("express").Router();

scheduleRoute.use(authUser);

scheduleRoute.route("/:id").all(allowScheduleHost).delete(deleteSchedule);

setInterval(async () => {
  const realSchedules = [];
  const checkSchedules = {};
  const schedules = await getAllSchedulesNeedToDo();
  schedules.forEach((schedule) => {
    if (!checkSchedules[schedule._id]) {
      realSchedules.unshift(schedule);
      checkSchedules[schedule._id] = 1;
    }
  });
  await Promise.all(
    realSchedules.map(async (schedule) => {
      try {
        const { amount, deviceID } = schedule;
        await AdafruitAPI.sendAmountFood({ value: amount });
        const newDeviceHistory = new deviceHistoryModel({ type: "food", amount, deviceID });
        await newDeviceHistory.save();
        if (schedule.type === "once") await scheduleModel.findByIdAndDelete(schedule._id);
      } catch (err) {
        console.log(err);
      }
    })
  );
}, 60000);

module.exports = scheduleRoute;
