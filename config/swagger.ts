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
      { name: "Teams", description: "Team management endpoints" },
      { name: "Challenges", description: "Challenge endpoints" },
      { name: "Stalls", description: "Stalls submission endpoints" },
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
          required: [
            "username",
            "email",
            "password",
            "universityName",
            "phoneNumber",
          ],
          properties: {
            username: {
              type: "string",
              minLength: 1,
              example: "johndoe",
            },
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
            universityName: {
              type: "string",
              minLength: 1,
              example: "MIT",
            },
            phoneNumber: {
              type: "string",
              minLength: 11,
              example: "03001234567",
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
        CreateTeamRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 50,
              example: "Team Alpha",
            },
            inviteeIds: {
              type: "array",
              items: {
                type: "string",
              },
              maxItems: 2,
              example: ["507f1f77bcf86cd799439011", "507f191e810c19729de860ea"],
            },
          },
        },
        InviteUserRequest: {
          type: "object",
          required: ["userId"],
          properties: {
            userId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
          },
        },
        StallsSubmissionRequest: {
          type: "object",
          required: [
            "name",
            "email",
            "companyOrUniversity",
            "productName",
            "productDescription",
            "phoneNumber",
            "teamMembers",
          ],
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@company.com",
            },
            companyOrUniversity: {
              type: "string",
              minLength: 2,
              maxLength: 200,
              example: "Tech Company Inc.",
            },
            productName: {
              type: "string",
              minLength: 2,
              maxLength: 150,
              example: "Amazing Product",
            },
            productDescription: {
              type: "string",
              minLength: 10,
              maxLength: 1000,
              example:
                "This is an innovative product that solves real-world problems.",
            },
            phoneNumber: {
              type: "string",
              minLength: 11,
              maxLength: 11,
              example: "03001234567",
            },
            teamMembers: {
              type: "string",
              minLength: 2,
              maxLength: 500,
              example: "John Doe, Jane Smith, Bob Johnson",
            },
          },
        },
        UserProfile: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            username: {
              type: "string",
              example: "johndoe",
            },
            email: {
              type: "string",
              example: "user@example.com",
            },
            universityName: {
              type: "string",
              example: "MIT",
            },
            phoneNumber: {
              type: "string",
              example: "03001234567",
            },
            isVerified: {
              type: "boolean",
              example: true,
            },
            role: {
              type: "string",
              example: "user",
            },
            isEligible: {
              type: "boolean",
              example: true,
            },
            assignedChallenge: {
              type: "number",
              example: 1,
            },
          },
        },
        Team: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              example: "Team Alpha",
            },
            owner: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            members: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["507f1f77bcf86cd799439011", "507f191e810c19729de860ea"],
            },
            joinRequests: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  user: {
                    type: "string",
                  },
                  createdAt: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },
            },
            invites: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  user: {
                    type: "string",
                  },
                  invitedBy: {
                    type: "string",
                  },
                  createdAt: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },
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
