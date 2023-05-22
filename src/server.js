const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config()

const PORT = process.env.PORT || 3000;
const app = require('./app');
const { mongooseConnect } = require('./utils/mongoose');

const baseDir = path.resolve();
let options = {
    key: fs.readFileSync(baseDir + '/src/certificate/key.pem'),
    cert: fs.readFileSync(baseDir + '/src/certificate/cert.pem'),
};

const server = https.createServer({
    key: options.key,
    cert: options.cert,
}, app);

const startServer = async () => {
    try {
        await mongooseConnect();

        server.on('error', (error) => {
            throw new Error(error.message);
        });

        server.listen(PORT, () => console.log(`Server listening on port https://localhost:${PORT}`));
    } catch (error) {
        console.log(`Server failed to start: ${error.message}`)
    }
}

startServer();