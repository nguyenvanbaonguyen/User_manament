const express = require("express");

const { saveUserHistory } = require("../userHistory/userHistory.controller");
const { register, login, sendRefreshToken, forgotPassword, resetPassword } = require("./auth.controller");

const authRoute = express.Router();

authRoute.post("/reset-password", saveUserHistory("Reset password"), resetPassword);

authRoute.post("/forgot-password", saveUserHistory("Request token to reset password"), forgotPassword);

authRoute.post("/register", saveUserHistory("Register new accout"), register);

authRoute.post("/login", saveUserHistory("Login to server"), login);

authRoute.post("/refresh-token", saveUserHistory("Send refresh token"), sendRefreshToken);

module.exports = authRoute;
