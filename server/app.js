const express = require("express");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const v1Router = require("./api/v1/v1.routes");
const errorReturn = require("./helpers/errorHandler");
const AppError = require("./classes/AppError.class");
const cors = require("cors");

const app = express();

app.use(
  cors({
    methods: ["PUT", "PATCH", "GET", "POST", "DELETE"],
    origin: "*",
  })
);
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  mongoSanitize({
    allowDots: true,
  })
);

app.use("/api/v1", v1Router);

app.all("*", (req, res, next) => {
  const err = new AppError(`Cant not find ${req.originalUrl} in this server`, 404);
  return next(err);
});

app.use(errorReturn);

module.exports = app;
