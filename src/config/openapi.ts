export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Commitment Management System API",
    version: "1.0.0",
    description:
      "A TypeScript + Express + Firebase API for commitments, categories, reminders, activity logs, and productivity analytics."
  },
  servers: [
    {
      url: "http://localhost:3000/api"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Resource not found" }
        }
      },
      Commitment: {
        type: "object",
        properties: {
          id: { type: "string", example: "commitment_123" },
          userId: { type: "string", example: "firebase_uid_1" },
          title: { type: "string", example: "Finish backend assignment" },
          description: { type: "string", example: "Complete routes and tests" },
          dueDate: { type: "string", format: "date-time" },
          mustStartByDate: { type: "string", format: "date-time" },
          estimatedHours: { type: "number", example: 6 },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"]
          },
          status: {
            type: "string",
            enum: ["pending", "in_progress", "completed", "overdue"]
          },
          categoryId: { type: "string", nullable: true },
          completedAt: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string", example: "category_123" },
          userId: { type: "string", example: "firebase_uid_1" },
          name: { type: "string", example: "School" },
          color: { type: "string", example: "blue" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Reminder: {
        type: "object",
        properties: {
          id: { type: "string", example: "reminder_123" },
          userId: { type: "string", example: "firebase_uid_1" },
          commitmentId: { type: "string", example: "commitment_123" },
          reminderDate: { type: "string", format: "date-time" },
          type: {
            type: "string",
            enum: ["email", "system"]
          },
          deliveryState: {
            type: "string",
            enum: ["pending", "sent", "failed"]
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      ActivityLog: {
        type: "object",
        properties: {
          id: { type: "string", example: "activity_123" },
          userId: { type: "string", example: "firebase_uid_1" },
          commitmentId: { type: "string", nullable: true },
          categoryId: { type: "string", nullable: true },
          reminderId: { type: "string", nullable: true },
          eventType: { type: "string", example: "commitment_created" },
          message: {
            type: "string",
            example: 'Commitment "Finish backend assignment" was created'
          },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      UserProfile: {
        type: "object",
        properties: {
          id: { type: "string", example: "user_123" },
          firebaseUid: { type: "string", example: "firebase_uid_1" },
          email: { type: "string", example: "student@example.com" },
          displayName: { type: "string", example: "Sharef Islam" },
          role: { type: "string", enum: ["user", "admin"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Auth"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "displayName"],
                properties: {
                  email: { type: "string", example: "student@example.com" },
                  password: { type: "string", example: "Password123" },
                  displayName: { type: "string", example: "Sharef Islam" },
                  role: { type: "string", enum: ["user", "admin"] }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "User registered successfully" }
        }
      }
    },
    "/auth/logout": {
      post: {
        summary: "Logout user on client side",
        tags: ["Auth"],
        security: [],
        responses: {
          "200": { description: "Logout response returned" }
        }
      }
    },
    "/auth/me": {
      get: {
        summary: "Get current authenticated user",
        tags: ["Auth"],
        responses: {
          "200": { description: "Authenticated user profile returned" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/auth/users/{id}/promote-admin": {
      patch: {
        summary: "Promote a user to admin",
        tags: ["Auth"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "User promoted to admin" },
          "403": { description: "Forbidden" }
        }
      }
    },
    "/commitments": {
      get: {
        summary: "Get all commitments for the authenticated user",
        tags: ["Commitments"],
        responses: {
          "200": { description: "List of commitments" }
        }
      },
      post: {
        summary: "Create a commitment",
        tags: ["Commitments"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Commitment" }
            }
          }
        },
        responses: {
          "201": { description: "Commitment created" },
          "400": { description: "Validation error" }
        }
      }
    },
    "/commitments/{id}": {
      get: {
        summary: "Get commitment by ID",
        tags: ["Commitments"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Commitment returned" },
          "404": { description: "Commitment not found" }
        }
      },
      put: {
        summary: "Update a commitment",
        tags: ["Commitments"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Commitment updated" }
        }
      },
      delete: {
        summary: "Delete a commitment",
        tags: ["Commitments"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "204": { description: "Commitment deleted" }
        }
      }
    },
    "/commitments/{id}/status": {
      patch: {
        summary: "Update commitment status",
        tags: ["Commitments"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["pending", "in_progress", "completed", "overdue"]
                  },
                  completedAt: {
                    type: "string",
                    format: "date-time",
                    nullable: true
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Commitment status updated" }
        }
      }
    },
    "/categories": {
      get: {
        summary: "Get all categories for the authenticated user",
        tags: ["Categories"],
        responses: {
          "200": { description: "List of categories" }
        }
      },
      post: {
        summary: "Create a category",
        tags: ["Categories"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Category" }
            }
          }
        },
        responses: {
          "201": { description: "Category created" }
        }
      }
    },
    "/categories/{id}": {
      get: {
        summary: "Get category by ID",
        tags: ["Categories"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Category returned" }
        }
      },
      put: {
        summary: "Update a category",
        tags: ["Categories"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Category updated" }
        }
      },
      delete: {
        summary: "Delete a category",
        tags: ["Categories"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "204": { description: "Category deleted" }
        }
      }
    },
    "/reminders": {
      get: {
        summary: "Get all reminders for the authenticated user",
        tags: ["Reminders"],
        responses: {
          "200": { description: "List of reminders" }
        }
      },
      post: {
        summary: "Create a reminder",
        tags: ["Reminders"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Reminder" }
            }
          }
        },
        responses: {
          "201": { description: "Reminder created" }
        }
      }
    },
    "/reminders/{id}": {
      get: {
        summary: "Get reminder by ID",
        tags: ["Reminders"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Reminder returned" }
        }
      },
      put: {
        summary: "Update a reminder",
        tags: ["Reminders"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Reminder updated" }
        }
      },
      delete: {
        summary: "Delete a reminder",
        tags: ["Reminders"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "204": { description: "Reminder deleted" }
        }
      }
    },
    "/activity-logs": {
      get: {
        summary: "Get all activity logs for the authenticated user",
        tags: ["Activity Logs"],
        responses: {
          "200": { description: "List of activity logs" }
        }
      }
    },
    "/activity-logs/{id}": {
      get: {
        summary: "Get activity log by ID",
        tags: ["Activity Logs"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Activity log returned" }
        }
      }
    },
    "/commitments/{id}/activity-logs": {
      get: {
        summary: "Get activity logs for a commitment",
        tags: ["Activity Logs"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Activity logs for commitment returned" }
        }
      }
    },
    "/analytics/summary": {
      get: {
        summary: "Get productivity summary analytics",
        tags: ["Analytics"],
        responses: {
          "200": { description: "Summary analytics returned" }
        }
      }
    },
    "/analytics/categories": {
      get: {
        summary: "Get category-based analytics",
        tags: ["Analytics"],
        responses: {
          "200": { description: "Category analytics returned" }
        }
      }
    },
    "/analytics/delays": {
      get: {
        summary: "Get delay analytics",
        tags: ["Analytics"],
        responses: {
          "200": { description: "Delay analytics returned" }
        }
      }
    }
  }
};