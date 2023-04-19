const { allowRoles, authUser } = require("../auth/auth.controller");
const { getAllDeviceHistories } = require("../deviceHistory/deviceHistory.controller");
const { createScheduleFromDevice, getSchedulesFromDevice } = require("../schedule/schedule.controller");
const {
  getDevices,
  deactiveDevice,
  activeDevice,
  allowDeviceHost,
  getDevice,
  deleteDevice,
  sendAmountFood,
  getAmountFoodInPlate,
} = require("./device.controller");

const deviceRoute = require("express").Router();

deviceRoute.use(authUser);

deviceRoute.route("/").get(allowRoles(["admin"]), getDevices);

//Todo: Just allow device host correctly
deviceRoute.use("/:id", allowDeviceHost);

deviceRoute.route("/:id/deactivate").patch(allowRoles(["admin"]), deactiveDevice);
deviceRoute.route("/:id/activate").patch(allowRoles(["admin"]), activeDevice);

deviceRoute.route("/:id").get(getDevice).delete(deleteDevice);
deviceRoute.route("/:id/schedules").post(createScheduleFromDevice).get(getSchedulesFromDevice);
deviceRoute.route("/:id/history-device").get(getAllDeviceHistories);
deviceRoute.post("/:id/food", sendAmountFood);
deviceRoute.get("/:id/food-in-plate", getAmountFoodInPlate);

module.exports = deviceRoute;
