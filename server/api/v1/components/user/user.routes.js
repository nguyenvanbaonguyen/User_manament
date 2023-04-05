const express = require("express");
const { saveHistoryUser } = require("../historyUser/historyUser.controller");
const { authUser, allowRoles } = require("../auth/auth.controller");
const { getMe, updateMe, getUser, deleteUser, getUserHistory, getUsers, uploadAvatar } = require("./user.controller");
const PhotoHandler = require("../../../../classes/PhotoHandler.class");
const userRoute = express.Router();

const handlerPhoto = new PhotoHandler("users", "user");
const uploadPhotoChain = handlerPhoto.chainHandlePhoto("avatar", 300);

//* must authentication for use this route
userRoute.use(authUser, saveHistoryUser);

userRoute.route("/me/upload-avatar").patch(...uploadPhotoChain, uploadAvatar);

userRoute.route("/me/histories").get(getUserHistory);

userRoute
  .route("/me")
  .get(getMe)
  .put(...uploadPhotoChain, updateMe);

//* must be admin to use this route
userRoute.use(allowRoles(["admin"]));

userRoute.route("/").get(getUsers);

userRoute.route("/:id").get(getUser).delete(deleteUser);

userRoute.route("/:id/histories").get(getUserHistory);

module.exports = userRoute;
