const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description: "API documentation for Expense Tracker backend",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"], // scan route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
