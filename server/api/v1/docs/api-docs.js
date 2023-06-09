const possibleErrors = require("./possibleErrors");
const filterScheme = require("./filterScheme");
const TokenScheme = require("./token.scheme");
const UserScheme = require("./user.scheme");

const apiDocs = {
  swagger: "2.0",
  info: {
    title: "Users API Docs V1",
    description: "A simple users API",
    version: "1.0.0",
  },
  host: "localhost:3000",
  basePath: "/api/v1",
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["auth"],
        summary: "register new user",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "body",
            in: "body",
            schema: filterScheme(UserScheme, { selects: "password phone email name" }),
          },
        ],
        responses: {
          200: {
            schema: {
              type: "object",
              properties: {
                status: {
                  example: "success",
                },
                data: filterScheme(UserScheme, { excludes: "password avatar" }),
              },
            },
          },
          ...possibleErrors(400, 409),
        },
        security: [
          {
            petstore_auth: ["write:pets", "read:pets"],
          },
        ],
      },
    },
    "/auth/login": {
      post: {
        tags: ["auth"],
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "body",
            in: "body",
            required: true,
            schema: filterScheme(UserScheme, { selects: "email password" }),
          },
        ],
        responses: {
          200: {
            schema: {
              type: "object",
              properties: {
                token: TokenScheme,
                status: {
                  example: "success",
                },
              },
            },
          },
          ...possibleErrors(400, 401, 500),
        },
        security: [
          {
            OAuth2: ["write:jwt"],
          },
        ],
      },
    },
    "/auth/refresh-token": {
      post: {
        tags: ["auth"],
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "body",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                refreshToken: {
                  example:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Mjk2Mjg0ZjQ0ZjFmOWZlNjA1OGU1ZiIsImlhdCI6MTY4MDQzMzkyNCwiZXhwIjoxNzE2NDMzOTI0fQ._B3lyeSd7U7MH9uCiDNSu_-x4pJRRO6hnX27fWXAMYo",
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              type: "object",
              properties: {
                status: {
                  example: "success",
                },
                token: TokenScheme,
              },
            },
          },
          401: {
            description: "Your refresh token is not valid",
          },
          400: {
            description: "Bad request",
          },
        },
        security: [
          {
            petstore_auth: ["write:pets", "read:pets"],
          },
        ],
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["auth"],
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "body",
            in: "body",
            required: true,
            schema: filterScheme(UserScheme, { selects: "email" }),
          },
        ],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              type: "object",
              properties: {
                status: {
                  example: "success",
                },
              },
            },
          },
          401: {
            description: "Your refresh token is not valid",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["auth"],
        description: "use when user forget password",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "token",
            in: "query",
            required: true,
            schema: {
              type: "string",
              example: "2e89c99bd1c016d971ee0ed4edd4f8dfda83a89a0f6692424dccc7358d2100dc",
            },
          },
          {
            name: "body",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                password: {
                  example: "12345678",
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              type: "object",
              properties: {
                status: {
                  example: "success",
                },
              },
            },
          },
          ...possibleErrors(400, 401, 429),
        },
      },
    },

    "/users/me": {
      get: {
        tags: ["user"],
        description: "get myself",
        consumes: ["application/json"],
        produces: ["application/json"],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              type: "object",
              properties: {
                status: {
                  example: "success",
                },
                data: filterScheme(UserScheme, { excludes: "password" }),
              },
            },
          },
          ...possibleErrors(400, 401),
        },
        security: [
          {
            jwt: [],
          },
        ],
      },
      put: {
        tags: ["user"],
        description: "update myself",
        consumes: ["multipart/form-data"],
        produces: ["application/json"],
        parameters: [
          {
            name: "avatar",
            in: "formData",
            type: "file",
          },
          {
            name: "data",
            in: "formData",
            type: "object",
            schema: filterScheme(UserScheme, { excludes: "password role" }),
          },
        ],
        security: [
          {
            jwt: [],
          },
        ],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              type: "object",
              properties: {
                status: {
                  example: "success",
                },
                data: filterScheme(UserScheme, { excludes: "password" }),
              },
            },
          },
          ...possibleErrors(400, 401),
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["user"],
        description: "Get user base IDs",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        security: [
          {
            jwt: [],
          },
        ],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              type: "object",
              properties: {
                status: {
                  example: "success",
                },
                data: filterScheme(UserScheme, { excludes: "password" }),
              },
            },
          },
          401: {
            description: "Your refresh token is not valid",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/users": {
      get: {
        tags: ["user"],
        description: "Get users",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "sort",
            in: "query",
            type: "string",
          },
          {
            name: "email",
            in: "query",
            type: "string",
          },
          {
            name: "phone",
            in: "query",
            type: "string",
          },
          {
            name: "page",
            in: "query",
            type: "number",
          },
          {
            name: "limit",
            in: "query",
            type: "number",
          },
        ],
        security: [
          {
            jwt: [],
          },
        ],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              type: "object",
              properties: {
                status: {
                  example: "success",
                },
                data: {
                  type: "array",
                  items: filterScheme(UserScheme, { excludes: "password" }),
                },
              },
            },
          },
          ...possibleErrors(400, 401, 403),
        },
      },
    },
  },
};

module.exports = apiDocs;
