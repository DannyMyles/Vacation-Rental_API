const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Totel API",
        version: "1.0.0",
        description: "API routes for Totel app",
        contact: {
          name: "Faizan",
          email: "faizan@gmail.com"
        }
      },
      servers: [
        {
          url: "http://localhost:5001",
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
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["./routes/*.js"],
  };
module.exports=swaggerOptions;  