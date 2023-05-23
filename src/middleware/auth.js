const jwt = require("jsonwebtoken");

const TokenBlacklist = require('../models/tokenblacklist.model');
const handleError = require('../utils/errors.handler');

/**
 * Middleware to authenticate and authorize a user token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The next function.
 */
async function authToken(req, res, next) {
    try {
        const authHeader = req.header('Authorization');

        // Check if Authorization header exists
        if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

        const token = authHeader.split(' ')[1];

        // Check if the token is blacklisted
        const blacklistedToken = await TokenBlacklist.findOne({ token });

        // Handle blacklisted token
        if (blacklistedToken) return res.status(401).json({ message: 'Unauthorized' });

        jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN, (err, user) => {
            // Handle invalid token
            if (err) res.status(403).json({ message: 'Token is not valid!' });

            // Set the user object in the request
            req.user = user;

            // Call the next function
            next();
        });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Middleware to authenticate and authorize an admin user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The next function or an error response.
 */
function authAdmin(req, res, next) {
    try {
        authToken(req, res, () => {
            // Check if the user is an admin
            if (req.user.isAdmin) {
                // Call the next function
                next();
            } else {
                // Set the response headers and handle unauthorized access
                res.header('Content-Type', 'application/json');
                res.status(403).json({ message: 'Unauthorized' });
            }
        })
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

module.exports = { authToken, authAdmin };