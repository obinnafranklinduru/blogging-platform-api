const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blogging Platform API Documentation',
      version: '1.0.0',
      description: 'API documentation for Blogging Platform API',
    },
    servers: [
      {
        url: 'https://localhost:3000',
      },
    ],
  },
  apis: ['../routes/auth/*.js'],
};

module.exports = swaggerOptions;