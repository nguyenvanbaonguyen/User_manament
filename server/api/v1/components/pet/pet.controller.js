const AppError = require("../../../../classes/AppError.class");
const { asyncWrapperMiddlewareObj } = require("../../../../helpers/errorWrapper");
const FactoryCRUD = require("../../factory/FactoryCRUD");
const petModel = require("./pet.model");

const createPet = async (req, res, next) => {
  let { data } = req.body;
  if (typeof data === "string") data = JSON.parse(data);
  data.userID = req.user?._id;
  const pet = new petModel(data);
  await pet.save();
  res.status(200).json({
    status: "success",
    pet,
  });
};

const petFactory = new FactoryCRUD(petModel);

const deletePet = petFactory.deleteOne();

const getPets = petFactory.getAll();

const getPetsFromUser = petFactory.getAll({ base: "userID" });

const getPet = petFactory.getOne();

const updatePet = petFactory.updateOne({ bans: ["userID"] });

const allowPetHost = petFactory.allowCorrectHost();

const allFns = { createPet, updatePet, getPetsFromUser, deletePet, getPets, getPet, allowPetHost };
asyncWrapperMiddlewareObj(allFns);
module.exports = allFns;
