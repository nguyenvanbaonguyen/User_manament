const express = require("express");

const { saveHistoryUser } = require("../historyUser/historyUser.controller");
const { register, login, sendRefreshToken, forgotPassword, resetPassword } = require("./auth.controller");

const authRoute = express.Router();

/**
 * @openapi
 * /min:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
authRoute.post("/reset-password", resetPassword);

authRoute.post("/forgot-password", forgotPassword);

authRoute.post("/register", saveHistoryUser, register);

authRoute.post("/login", saveHistoryUser, login);

authRoute.post("/refresh-token", sendRefreshToken);

module.exports = authRoute;
