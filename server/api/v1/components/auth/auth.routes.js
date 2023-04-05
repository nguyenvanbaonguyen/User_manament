const express = require("express");

const { saveHistoryUser } = require("../historyUser/historyUser.controller");
const { register, login, sendRefreshToken, forgotPassword, resetPassword } = require("./auth.controller");

const authRoute = express.Router();

authRoute.post("/reset-password", resetPassword);

authRoute.post("/forgot-password", forgotPassword);

authRoute.post("/register", saveHistoryUser, register);

authRoute.post("/login", saveHistoryUser, login);

authRoute.post("/refresh-token", sendRefreshToken);

module.exports = authRoute;
