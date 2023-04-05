const APIFeatures = require("../../../classes/APIFeature.class");
const AppError = require("../../../classes/AppError.class");

class FactoryCRUD {
  constructor(Model, options) {
    this.Model = Model;
    this.options = options;
    this.getOne = this.getOne.bind(this);
    this.getAll = this.getAll.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }
}

FactoryCRUD.prototype.getOne = async function (req, res, next) {
  const data = await this.Model.findById(req.params.id);
  if (!data) return next(new AppError(`ID ${id} is not exists`, 400));

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
};

FactoryCRUD.prototype.getAll = async function (req, res, next) {
  const selectOption = this.options?.select || null;

  const data = await new APIFeatures(this.Model.find().select(selectOption), req.query).all().query;
  const totalItems = await new APIFeatures(this.Model.find(), req.query).filter().query.count();

  res.status(200).json({
    status: "success",
    data: {
      data,
      totalItems,
    },
  });
};

FactoryCRUD.prototype.deleteOne = async function (req, res, next) {
  const data = await this.Model.findByIdAndDelete(req.params.id);

  if (!data) return next(new AppError(`No data found with that ID`, 404));

  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = FactoryCRUD;
