const swaggerUi = require("swagger-ui-express");
const apiDocs = require("./api-docs");

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocs));
}

module.exports = swaggerDocs;
