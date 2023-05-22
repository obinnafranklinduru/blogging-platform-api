const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

require('dotenv').config()

const PORT = process.env.PORT || 3000;
const api = require('./src/routes/api')
const { mongooseConnect } = require('./src/utils/mongoose');

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
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use('/api/v1', api);

const startServer = async () => {
    try {
        await mongooseConnect();

        app.on('error', (error) => {
            throw new Error(error.message);
        });

        app.listen(PORT, () => console.log(`Server listening on port https://localhost:${PORT}`));
    } catch (error) {
        console.log(`Server failed to start: ${error.message}`)
    }
}

startServer();