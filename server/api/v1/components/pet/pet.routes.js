const { authUser, allowRoles } = require("../auth/auth.controller");
const { updatePet, deletePet, createPet, getPets, getPet, allowPetHost } = require("./pet.controller");
const PhotoHandler = require("../../../../classes/PhotoHandler.class");
const { createDeviceFromPet, getDevicesFromPet } = require("../device/device.controller");
const { saveUserHistory } = require("../userHistory/userHistory.controller");

const petRoute = require("express").Router();

const handlerPhoto = new PhotoHandler("users", "user", "data");
const uploadPhotoChain = handlerPhoto.chainHandlePhoto("avatar", 300);

petRoute.use(authUser);

petRoute
  .route("/")
  .post(saveUserHistory("Create new pet"), ...uploadPhotoChain, createPet)
  .get(allowRoles(["admin"]), getPets);

petRoute
  .route("/:id")
  .all(allowPetHost)
  .put(...uploadPhotoChain, updatePet)
  .delete(deletePet)
  .get(getPet);

petRoute.route("/:id/devices").all(allowPetHost).post(createDeviceFromPet).get(getDevicesFromPet);

module.exports = petRoute;
