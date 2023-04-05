const setLocalsRes = (data, res) => {
  if (!res.locals) res.locals = data;
  else res.locals = { ...res.locals, ...data };
};

const getLocalsRes = (key, res) => {
  return res.locals[key];
};

module.exports = { setLocalsRes, getLocalsRes };
