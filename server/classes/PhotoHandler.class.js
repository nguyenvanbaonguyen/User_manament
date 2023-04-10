const multer = require("multer");
const sharp = require("sharp");
const imageModel = require("../api/v1/components/image/image.model");
const { HOST, PORT, DEPLOY_PORT } = require("../config");
const AppError = require("./AppError.class");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else cb(new AppError("Pls upload image", 400));
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

class PhotoHandler {
  constructor(nameStorage, placeGetID, placeSpread) {
    this.nameStorage = nameStorage;
    this.placeGetID = placeGetID;
    this.type = "public";
    this.placeSpread = placeSpread;
  }

  chainHandlePhotos(fields) {
    return [this.uploadPhotos(fields), this.resizePhotos()];
  }

  chainHandlePhoto(field, width) {
    return [this.uploadPhoto(field), this.resizePhoto(width)];
  }
}

PhotoHandler.prototype.uploadPhoto = function (field) {
  return upload.single(field);
};

PhotoHandler.prototype.uploadPhotos = function (fields) {
  return upload.fields(fields);
};

PhotoHandler.prototype.resizePhotos = function () {
  return async (req, res, next) => {
    const bodyImages = {};
    Object.entries(req.files).forEach(async ([fieldName, images]) => {
      images.map(async (image, index) => {
        const fileName = `${this.nameStorage}-${req[this.placeGetID].id}-${Date.now()}-${index}`;
        bodyImages[fieldName] = bodyImages[fieldName] ? [...bodyImages[fieldName], fileName] : [fileName];
        await sharp(image.buffer).resize(undefined).webp().toFile(`${__imagedir}/${this.nameStorage}/${fileName}`);
      });
    });
    req.body = { ...req.body, ...bodyImages };
    next();
  };
};

PhotoHandler.prototype.resizePhoto = function (width) {
  return async (req, res, next) => {
    if (!req.file) return next();
    const fileName = `${this.nameStorage}-${req[this.placeGetID].id}-${Date.now()}.webp`;
    const fieldName = req.file.fieldname;
    const imageSave = new imageModel({ url: `${HOST}:${DEPLOY_PORT}/api/v1/images/${fileName}`, type: this.type });
    if (req.user) imageSave.userID = req.user._id;
    const imageStore = await imageSave.save();

    if (this.placeSpread) {
      const data = req.body[this.placeSpread];
      req.body[this.placeSpread] = data
        ? { ...JSON.parse(data), [fieldName]: imageStore._id }
        : { [fieldName]: imageStore._id };
    } else req.body[fieldName] = imageStore._id;

    await sharp(req.file.buffer).resize(width).webp().toFile(`${__imagedir}/${this.nameStorage}/${fileName}`);
    next();
  };
};

module.exports = PhotoHandler;
