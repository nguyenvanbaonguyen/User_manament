const ImageScheme = require("./imageScheme");

const RegisterUserSchema = {
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
  },
};

const UserResponse = {
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

// consider type object have protery, type array have items

//! Module test
// const registerUserSchema = {
//   type: "object",
//   properties: {
//     name: {
//       type: "string",
//       example: "doggie",
//     },
//     photoUrls: {
//       type: "array",
//       items: {
//         type: "string",
//       },
//     },
//     tags: {
//       type: "array",
//     },
//     status: {
//       type: "string",
//       description: "pet status in the store",
//       enum: ["available", "pending", "sold"],
//     },
//   },
// };

module.exports = { RegisterUserSchema, UserResponse };
