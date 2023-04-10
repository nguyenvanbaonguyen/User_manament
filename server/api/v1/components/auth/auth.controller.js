const AppError = require("../../../../classes/AppError.class");
const { asyncWrapperMiddlewareObj } = require("../../../../helpers/errorWrapper");
const JWT = require("../../services/JWT.service");
const UserModel = require("../user/user.model");
const UserValidation = require("../user/user.validation");
const redis = require("../../services/Redis.service");
const Crypto = require("../../../../classes/Crypto.class");

const register = async (req, res, next) => {
  const dataUser = req.body;

  const isExists = await UserModel.findOne({ email: dataUser.email });
  if (isExists) return next(new AppError(`Email ${dataUser.email} has been registed before`, 409));

  const user = new UserModel(dataUser);
  const savedUser = await user.save();
  savedUser.password = undefined;

  req.user = user;
  return res.status(200).json({
    data: {
      data: user,
    },
    status: "success",
  });
};

const login = async (req, res, next) => {
  const { email, password } = await UserValidation.validate(req.body, { requires: ["email", "password"] });

  const user = await UserModel.findOne({ email }).select("password");
  if (!user) return next(new AppError("User is not register", 404));

  const isCorrectPassword = await user.checkPassword(password);
  if (!isCorrectPassword) return next(new AppError("Your password is wrong", 401));

  const token = await JWT.signToken({ id: user._id });
  user.password = undefined;

  req.user = user;
  res.status(200).json({
    status: "success",
    data: {
      token,
      data: user,
    },
  });
};

const sendRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new AppError("Pls send refreshToken", 400));

  const { userId } = await JWT.verifyRefeshToken(refreshToken);
  const token = await JWT.signToken({ id: userId });

  res.status(200).json({
    status: "success",
    token,
  });
};

const authUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    token = req.headers.authorization.split(" ")[1];

  if (!token) return next(new AppError("Pls login to get access this token", 401));

  const { id } = await JWT.verifyAccessToken(token);
  const user = await UserModel.findById(id);
  if (!user) return next(new AppError("The token belonging to user does no longer exist", 400));

  req.user = user;
  next();
};

const allowRoles = (roles) => async (req, res, next) => {
  const user = req.user;
  if (!roles.includes(user.role)) return next(new AppError("You dont have permission to perform this action", 403));
  next();
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("Pls send email", 400));
  await UserValidation.validateKey("email", email);
  const user = await UserModel.findOne({ email: email });
  if (!user) return next(new AppError("This email is not exists", 404));
  const [token, hashedToken] = Crypto.createPairHashToken();
  const ttl = await redis.ttl(`${user._id}-hashedToken`);
  if (ttl !== -2) return next(new AppError(`You must wait ${ttl} seconds to continue this service`, 429));
  await redis.set(`${user._id}-hashedToken`, 111, 60);
  await redis.set(`${hashedToken}-hashedToken`, `${user._id}-hashedToken`, 60);

  await mailSender.sendMail({ email, subject: "Reset password", token });

  res.status(200).json({
    status: "success",
    message: "Pls check your email to reset password",
  });
};

const resetPassword = async (req, res, next) => {
  const token = req.query.token;
  if (!token) return next(new AppError("Pls provide token reset to continute", 401));

  const hashedToken = Crypto.hashToken(token);
  const valueToken = await redis.get(`${hashedToken}-hashedToken`);
  if (!valueToken) return next(new AppError("Your token is not valid or expired, pls try forget password again", 401));
  const userId = valueToken.split("-")[0];

  const password = req.body.password;
  await UserValidation.validateKey("password", password);
  redis.del(`${hashedToken}-hashedToken`);

  await UserModel.findByIdAndUpdate(userId, { password }, { new: true });

  res.status(204).json({
    status: "success",
  });
};

const allFns = { register, login, sendRefreshToken, authUser, forgotPassword, resetPassword };

asyncWrapperMiddlewareObj(allFns);

module.exports = { ...allFns, allowRoles };
