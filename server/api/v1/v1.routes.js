const express = require("express");
const v1Router = express.Router();
const swaggerUi = require("swagger-ui-express");
const authRoute = require("./components/auth/auth.routes");
const imageRoute = require("./components/image/image.routes");
const userRoute = require("./components/user/user.routes");
const apiDocs = require("./docs/api-docs");

v1Router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocs));

v1Router.use("/auth", authRoute);

v1Router.use("/users", userRoute);

v1Router.use("/images", imageRoute);

module.exports = v1Router;
