class FactoryRelation {
  constructor(Scheme) {
    this.Scheme = Scheme;
    this.childrenSchemes = {};
    this.latestScheme = null;
    this.Scheme.statics.findBaseScheme = this.findBaseScheme.bind(this);
  }

  createRelation(childrenScheme, config) {
    if (this.childrenSchemes[childrenScheme]) return;
    this.childrenSchemes[childrenScheme] = config;
    this.latestScheme = childrenScheme;
    return this;
  }

  setDeleteCascade(ChildrenScheme) {
    if (!ChildrenScheme) ChildrenScheme = this.latestScheme;
    const config = this.childrenSchemes[ChildrenScheme];

    this.Scheme.post(/^(delete)|(Delete)$/, async (doc) => {
      if (!doc?._id) return;
      const items = await ChildrenScheme.find({ [config.foreignField]: doc._id }).select("_id");
      await Promise.all(items.map(async (item) => await ChildrenScheme.findByIdAndDelete(item._id)));
    });
    return this;
  }

  setPopulate(ChildrenScheme) {
    if (!ChildrenScheme) ChildrenScheme = this.latestScheme;
    const config = this.childrenSchemes[ChildrenScheme];
    this.Scheme.virtual(config.ref, config);
    return this;
  }

  findBaseScheme(childrenScheme, id) {
    const { foreignField } = this.childrenSchemes[childrenScheme];
    return childrenScheme.find({ [foreignField]: id });
  }
}

module.exports = FactoryRelation;
