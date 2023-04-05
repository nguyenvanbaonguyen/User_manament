const multer = require("multer");
// const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else cb(new AppError("Pls upload image", 400));
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadPhoto = (field) => upload.single(field);

const uploadPhotos = (fields) => upload.fields(fields);

const resizePhotos = (nameStorage, placeId) => async (req, res, next) => {
  const imageBody = {};
  Object.entries(req.files).forEach(async ([fieldName, images]) => {
    images.map(async (image, index) => {
      const fileName = `${nameStorage}-${req[placeId].id}-${Date.now()}-${index}`;
      imageBody[fieldName] = imageBody[fieldName] ? [...imageBody[fieldName], fileName] : [fileName];
      // await sharp(image.buffer).resize(undefined).webp().toFile(`${__imagedir}/${nameStorage}/${fileName}.webp`);
    });
  });
  req.body = { ...req.body, ...imageBody };
  next();
};

const resizePhoto = (nameStorage, placeId) => async (req, res, next) => {
  if (!req.file) next();
  const fileName = `${nameStorage}-${req[placeId].id}-${Date.now()}`;
  const fieldName = req.file.fieldname;
  req.body[fieldName] = { url: fieldName };
  // await sharp(req.file.buffer).resize(undefined).webp().toFile(`${__imagedir}/${nameStorage}/${fileName}.webp`);
  next();
};

module.exports = { uploadPhoto, resizePhoto, uploadPhotos, resizePhotos };
