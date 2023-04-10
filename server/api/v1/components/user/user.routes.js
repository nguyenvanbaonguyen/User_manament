const express = require("express");
const { saveUserHistory, getUserHistory } = require("../userHistory/userHistory.controller");
const { authUser, allowRoles } = require("../auth/auth.controller");
const { getMe, updateMe, getUser, deleteUser, getUsers } = require("./user.controller");
const PhotoHandler = require("../../../../classes/PhotoHandler.class");
const { getPetsFromUser } = require("../pet/pet.controller");
const userRoute = express.Router();

const handlerPhoto = new PhotoHandler("users", "user");
const uploadPhotoChain = handlerPhoto.chainHandlePhoto("avatar", 300);

//! must authentication for use this route
userRoute.use(authUser);
userRoute.route("/me/histories").get(getUserHistory);
userRoute
  .route("/me")
  .get(getMe)
  .put(...uploadPhotoChain, saveUserHistory("Update yourself"), updateMe);
userRoute.route("/me/pet").get(getPetsFromUser);

//! must be admin to use this route
userRoute.use(allowRoles(["admin"]));
userRoute.route("/").get(getUsers);
userRoute.route("/:id").get(getUser).delete(deleteUser);
userRoute.route("/:id/histories").get(getUserHistory);

module.exports = userRoute;
