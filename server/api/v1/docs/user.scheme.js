const ImageScheme = require("./image.scheme");

const UserScheme = {
  type: "object",
  properties: {
    name: {
      type: "string",
      example: "bao nguyen",
    },
    email: {
      type: "string",
      format: "email",
      example: "nguyenvanbaonguyennth@gmail.com",
    },
    phone: {
      type: "string",
      example: "0905824884",
    },
    password: {
      type: "string",
      example: "12345678",
    },
    role: {
      example: "user",
    },

    avatar: ImageScheme,
  },
};

module.exports = UserScheme;
