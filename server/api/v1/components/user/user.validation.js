const Joi = require("joi");
const Validation = require("../../../../classes/Validation.class");

const userValidator = {
  password: Joi.string().min(6),
  email: Joi.string().email(),
  phone: Joi.string().pattern(new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)),
  name: Joi.string(),
  role: Joi.string(),
  avatar: Joi.object({
    url: Joi.string(),
  }),
};

const UserValidation = new Validation(userValidator);

UserValidation.setDefaultOptions(["password", "email", "phone", "name"], ["role"]);

module.exports = UserValidation;
