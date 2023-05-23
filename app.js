const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();

const authRouter = require('./src/routes/auth/auth.router')
const categoriesRouter = require('./src/routes/categories/categories.router')
const postsRouter = require('./src/routes/posts/posts.router');
const usersRouter = require('./src/routes/users/users.router')

// Swagger configuration options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blogging Platform API Documentation',
      version: '1.0.0',
      description: 'RESTful API documentation for a blogging platform that allows users to create, read, update, and delete blog posts. The API supports user authentication and authorization, allowing users to create and manage their own posts.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();

// Security configuration
app.use(helmet());
app.use(cors());
app.options('*', cors())

// Enable parsing Json payload  in the request body
app.use(express.json());

// Logs information about incoming requests and outgoing responses in the terminal
app.use(morgan('combined'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
    next()
});

// Routes
app.use('/api/v1/api-docs', swaggerUi.serve);
app.get(
  '/api/v1/api-docs',
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      docExpansion: 'none',
      defaultModelsExpandDepth: -1,
    },
  })
);
app.use('/api/v1/public/uploads', express.static(__dirname + '/public/uploads'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;