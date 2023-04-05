const imageRoute = require("express").Router();
const fs = require("fs");
const { promisify } = require("util");
const AppError = require("../../../../classes/AppError.class");

imageRoute.get("/:fileName", async (req, res, next) => {
  const { fileName } = req.params;
  const location = `${__imagedir}/users/${fileName}`;
  const isExist = await promisify(fs.exists)(location);
  if (!isExist) return next(new AppError("File not found", 404));
  res.status(200).sendFile(location);
});

module.exports = imageRoute;
