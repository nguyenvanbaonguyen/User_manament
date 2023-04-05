const Joi = require("joi");
const AppError = require("./AppError.class");

const options = {
  requires: [],
  bans: [],
  default: false,
};

class Validation {
  constructor(validators) {
    this.validators = validators;
    this.cached = {};
    this.options = {
      requires: [],
      bans: [],
    };
  }

  async validate(data, options) {
    try {
      options = options ? options : this.options;
      const objValidation = this.getObjValidation(options.requires || [], options.bans || []);
      const scheme = Joi.object(objValidation);
      return await scheme.validateAsync(data, { abortEarly: false });
    } catch (err) {
      const errors = [];
      err?.details?.forEach((detail) => errors.push(detail.message));
      throw new AppError(errors.join(". "), 400);
    }
  }

  async validateKey(key, data, required = true) {
    try {
      if (!this.validators[key]) throw new Error(`${key} is not in validators, developer check agains`);
      if (required) return await this.validators[key].required().validateAsync(data);
      else return await this.validators[key].validateAsync(data);
    } catch (err) {
      throw new AppError(err.message?.replace("value", key), 404);
    }
  }

  getObjValidation(requires, bans) {
    const objValidation = {};
    const keysValidation = Object.keys(this.validators).filter((key) => !bans.includes(key));
    keysValidation.forEach((key) => {
      if (requires.includes(key)) objValidation[key] = this.validators[key].required();
      else objValidation[key] = this.validators[key];
    });
    return objValidation;
  }

  setDefaultOptions(requires = [], bans = []) {
    if (Array.isArray(requires) && requires.length > 0) this.options.requires = requires;
    if (Array.isArray(bans) && bans.length > 0) this.options.bans = bans;
  }
}

module.exports = Validation;
