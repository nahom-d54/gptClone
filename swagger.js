const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");

const router = express.Router();

// Define Swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bank exchange rate API",
      version: "1.0.0",
      description: "Ethiopian banks exchange rate API",
    },
    servers: [
      {
        url: process.env.APP_URL || "http://localhost:3000",
        description: "Production server",
      },
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Rates",
        description: "Exchange rates",
      },
      {
        name: "Subscription",
        description: "Subscription API",
      },
      {
        name: "Subscription Types",
        description: "Subscription types API",
      },
      {
        name: "User",
        description: "Users API",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to your API docs
};

// Initialize Swagger JSDoc
const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger API documentation
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
