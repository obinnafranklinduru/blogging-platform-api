const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const User = require('../../models/users.model');
const TokenBlacklist = require('../../models/tokenblacklist.model');
const handleError = require('../../utils/errors.handler')

/**
 * Register a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the registered user's ID or an error message.
 */
async function httpRegisterUser(req, res) {
    try {
        const { username, email, password } = req.body;

        // Check if required fields are provided
        if (!username || !email || !password) return res.status(400)
            .json({ message: 'Please provide username, email and password' });

        // Create a new user with the provided details
        const user = await User.create({ username, email, password });
        
        // Handle user creation failure
        if (!user) return res.status(501).json({ registration: 'Not Implemented' });

        // Set the response headers and return success message with the registered user's ID
        res.header('Content-Type', 'application/json');
        res.status(201).json({ message: `user registered with ID: ${user._id}` });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Register a new admin.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the registered admin's ID or an error message.
 */
async function httpRegisterAdmin(req, res) {
    try {
        const { username, email, password, isAdmin } = req.body;

        // Check if required fields are provided
        if (!username || !email || !password) return res.status(400)
            .json({ message: 'Please provide username, email, admin status and password' });
        
        // Check if required admin status is set to true
        if (!isAdmin) return res.status(400)
            .json({ message: 'Please set admin status to true' });

        // Create a new admin with the provided details
        const user = await User.create({ username, email, password, isAdmin });
        
        // Handle admin creation failure
        if (!user) return res.status(501).json({ registration: 'Not Implemented' });

        // Set the response headers and return success message with the registered admin's ID
        res.header('Content-Type', 'application/json');
        res.status(201).json({ message: `admin registered with ID: ${user._id}` });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Login a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the access token or an error message.
 */
async function httpLoginUser(req, res) {
    try {
        const { username, email, password } = req.body;

        // Validate that username or email and password are provided
        if ((!username && !email) || !password) return res.status(400)
            .json({ message: 'Please provide username/email and password' });

        let user;

        // Find user by username
        if (username) {
            const formattedName = username.trim().replace(/\s/g, '').toLowerCase();
            user = await User.findOne({ username: formattedName });
        }

        // Find user by email
        if (email) {
            const formattedEmail = email.trim().toLowerCase();
            user = await User.findOne({ email: formattedEmail });
        }

        // Handle incorrect credentials for username or email
        if (!user) return res.status(401).json({ message: 'Incorrect credentials' });

        // Compare password with hashed password
        const auth = await bcrypt.compare(password, user.password);

        // Handle incorrect credentials for password
        if (!auth) return res.status(401).json({ message: 'Incorrect credentials' });

        // Generate and sign the access token
        const accessToken = jwt.sign(
            { _id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET_ACCESS_TOKEN,
            { expiresIn: '1d' }
        );

        // Handle login failure
        if (!accessToken) return res.status(501).json({ message: 'Login failed' });

        // Set the response headers and return the access token
        res.header('Content-Type', 'application/json');
        res.status(200).json({ accessToken });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Logout a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response indicating the logout status.
 */
async function httpLogoutUser(req, res) {
    try {
        const authHeader = req.header('Authorization');

        // Check if Authorization header exists
        if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

        const token = authHeader.split(' ')[1];

        // Add the token to the blacklist
        const blacklist = await TokenBlacklist.create({ token });

        // Handle token blacklist failure
        if (!blacklist) return res.status(501).json({ message: 'Logout not implemented' })

        // Set the response headers and send the response with a successful logout message
        res.header('Content-Type', 'application/json');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        const errors = handleError(error);
        
        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

module.exports = {
    httpRegisterUser,
    httpRegisterAdmin,
    httpLoginUser,
    httpLogoutUser,
}