const { authUser, allowRoles } = require("../auth/auth.controller");
const {
  updatePet,
  deletePet,
  createPet,
  getPets,
  getPet,
  allowPetHost,
} = require("./pet.controller");
const PhotoHandler = require("../../../../classes/PhotoHandler.class");
const { createDeviceFromPet, getDevicesFromPet } = require("../device/device.controller");

const petRoute = require("express").Router();

const handlerPhoto = new PhotoHandler("users", "user", "data");
const uploadPhotoChain = handlerPhoto.chainHandlePhoto("avatar", 300);

petRoute.use(authUser);

petRoute
  .route("/")
  .post(...uploadPhotoChain, createPet)
  .get(allowRoles(["admin"]), getPets);

petRoute
  .use("/:id", allowPetHost)
  .route("/:id")
  .put(...uploadPhotoChain, updatePet)
  .delete(deletePet)
  .get(getPet);

petRoute
  .use("/:id/devices", allowPetHost)
  .route("/:id/devices")
  .post(createDeviceFromPet)
  .get(getDevicesFromPet);

module.exports = petRoute;
