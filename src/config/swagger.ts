import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Commitment Management System API",
    version: "1.0.0",
    description: "API for managing commitments, categories, and reminders"
  },
  servers: [{ url: "http://localhost:3000/api" }],
  paths: {
    "/commitments": {
      get: { summary: "Get all commitments", responses: { "200": { description: "Success" } } },
      post: { summary: "Create a commitment", responses: { "201": { description: "Created" } } }
    },
    "/commitments/{id}": {
      get: { summary: "Get commitment by id", responses: { "200": { description: "Success" } } },
      put: { summary: "Update commitment", responses: { "200": { description: "Updated" } } },
      delete: { summary: "Delete commitment", responses: { "204": { description: "Deleted" } } }
    },
    "/categories": {
      get: { summary: "Get all categories", responses: { "200": { description: "Success" } } },
      post: { summary: "Create a category", responses: { "201": { description: "Created" } } }
    },
    "/categories/{id}": {
      get: { summary: "Get category by id", responses: { "200": { description: "Success" } } },
      put: { summary: "Update category", responses: { "200": { description: "Updated" } } },
      delete: { summary: "Delete category", responses: { "204": { description: "Deleted" } } }
    },
    "/reminders": {
      get: { summary: "Get all reminders", responses: { "200": { description: "Success" } } },
      post: { summary: "Create a reminder", responses: { "201": { description: "Created" } } }
    },
    "/reminders/{id}": {
      get: { summary: "Get reminder by id", responses: { "200": { description: "Success" } } },
      put: { summary: "Update reminder", responses: { "200": { description: "Updated" } } },
      delete: { summary: "Delete reminder", responses: { "204": { description: "Deleted" } } }
    }
  }
};

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
};