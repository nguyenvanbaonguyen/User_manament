const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hello World",
      version: "2.0.0",
    },
  },
  apis: ["./server/api/v1/components/auth/auth.routes.js"],
};

const openapiSpecification = swaggerJsdoc(options);

console.log(openapiSpecification);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
}

module.exports = swaggerDocs;
