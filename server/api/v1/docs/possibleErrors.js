const errors = {
  400: {
    description: "Bad request",
  },
  401: {
    description: "Unauthorized",
  },
  403: {
    description: "Forbidden",
  },
  404: {
    description: "Not found",
  },
  409: {
    description: "Conflict",
  },
  429: {
    description: "Too manu request",
  },
  500: {
    description: "Internal Server Error",
  },
};

const possibleErrors = (...arr) => {
  const results = {};
  arr.forEach((err) => (results[err] = errors[err]));
  return results;
};

module.exports = possibleErrors;
