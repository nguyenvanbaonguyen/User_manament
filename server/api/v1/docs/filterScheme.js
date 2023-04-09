const filterScheme = (scheme, options) => {
  const filtedScheme = {};
  filtedScheme.type = scheme.type;
  filtedScheme.properties = {};

  const selects = options.selects ? options.selects.split(" ") : undefined;
  const excludes = options.excludes ? options.excludes.split(" ") : undefined;

  if (selects) {
    selects.forEach((select) => {
      filtedScheme.properties[select] = scheme.properties[select];
    });
  }
  if (excludes) {
    Object.keys(scheme.properties).forEach((prop) => {
      if (!excludes.includes(prop)) filtedScheme.properties[prop] = scheme.properties[prop];
    });
  }
  return filtedScheme;
};

module.exports = filterScheme;
