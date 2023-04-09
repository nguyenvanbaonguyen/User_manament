const { default: axios } = require("axios");
const express = require("express");
const v1Router = express.Router();
const authRoute = require("./components/auth/auth.routes");
const deviceRoute = require("./components/device/device.routes");
const imageRoute = require("./components/image/image.routes");
const petRoute = require("./components/pet/pet.routes");
const userRoute = require("./components/user/user.routes");
const swaggerDocs = require("./docs/swagger");
const scheduleRoute = require("./components/schedule/schedule.routes");

v1Router.use("/auth", authRoute);

v1Router.use("/users", userRoute);

v1Router.use("/images", imageRoute);

v1Router.use("/pets", petRoute);

v1Router.use("/devices", deviceRoute);

v1Router.use("/schedules", scheduleRoute);

swaggerDocs(v1Router);

module.exports = v1Router;
