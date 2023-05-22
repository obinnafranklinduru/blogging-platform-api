const path = require('path');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const baseDir = path.resolve();
const api = require('./routes/api')

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
app.use('/public/uploads', express.static(baseDir + '/public/uploads'));
app.use('/public/uploads', express.static(baseDir + '/public/uploads'));
app.use('/api/v1', api);

module.exports = app;