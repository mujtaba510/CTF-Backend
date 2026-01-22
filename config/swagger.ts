import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CTF-Backend API",
      version: "1.0.0",
      description:
        "API documentation for CTF-Backend, offering endpoints for user authentication, account management, and related functionalities.",
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Users", description: "User management endpoints" },
      { name: "Admin", description: "Admin management endpoints" },
    ],
    servers: [
      {
        url: "https://ctf-backend-11.onrender.com",
        description: "Production server",
      },
      {
        url:
          process.env.PUBLIC_BASE_URL?.trim() ||
          `http://localhost:${process.env.PORT || 5000}`,
        description: process.env.PUBLIC_BASE_URL
          ? "Public server"
          : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        SignupRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "password123",
            },
          },
        },
        OtpRequest: {
          type: "object",
          required: ["email", "otp"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            otp: {
              type: "string",
              length: 6,
              example: "123456",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              example: "password123",
            },
          },
        },
        ForgetPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["email", "newPassword"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            newPassword: {
              type: "string",
              minLength: 6,
              example: "newpassword123",
            },
          },
        },
        ChangePasswordRequest: {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: {
              type: "string",
              example: "oldpassword123",
            },
            newPassword: {
              type: "string",
              minLength: 6,
              example: "newpassword123",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./dist/controllers/*.js", "./controllers/*.ts"], // Path to files with JSDoc comments
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerSpec };
