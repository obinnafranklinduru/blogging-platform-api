const mongoose = require('mongoose');
const { isEmail } = require('validator');

const User = require('../../models/users.model');
const handleError = require('../../utils/errors.handler');

/**
 * Get all users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the users or an error message.
 */
async function httpGetUsers(req, res) {
    try {
        // Retrieve all users and exclude certain fields
        const users = await User.find({})
            .sort('-createdAt')
            .select('-__v -password -firstname -surname -updatedAt');

        // Handle if no users are found
        if (users.length === 0) return res.status(404).json({ message: 'No users'});

        // Set the response headers and send the users
        res.header('Content-type', 'application/json');
        res.status(200).json({ users });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Get a user by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the user or an error message.
 */
async function httpGetUserByID(req, res) {
    try {
        // Validate the provided ID
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ message: 'Invalid ID' });
        
        // Find the user by ID and exclude certain fields
        const user = await User.findById(req.params.id)
            .select('-_id -__v -password');

        // Handle if user is not found
        if (!user) return res.status(404)
            .json({ message: `user with ID ${req.params.id} not found` });

        // Set the response headers and send the user
        res.header('Content-type', 'application/json');
        res.status(200).json({ user });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Get the count of users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the count of users or an error message.
 */
async function httpGetUsersCount(req, res) {
    try {
        // Count the number of users
        const usersCount = await User.countDocuments();

        // Handle if no users are found
        if (usersCount === 0) return res.status(404).json({ message: 'No users found' });

        // Set the response headers and send the users count
        res.header('Content-type', 'application/json');
        res.status(200).json({ usersCount });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Update a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the updated user or an error message.
 */
async function httpUpdateUser(req, res) {
    try {
        const { _id } = req.user;
        const { firstname, surname, username, email, password } = req.body;

        // Find the user by ID
        const user = await User.findById(_id);

        // Handle if user is not found
        if (!user) return res.status(404).json({ message: 'user not found' });

        
        let profilePicturePath = '';

        // Check if a file was uploaded and generate the profilePicturePath
        if (req.file) {
            const { filename } = req.file;
            profilePicturePath = `${req.protocol}://${req.get('host')}/public/uploads/${filename}`;
        }

        // Check if firstname or surname exceeds the maximum length
        if (firstname && firstname.length > 32 || surname && surname.length > 32) {
            return res.status(400)
                .json({ message: 'firstname and surname fields must not exceed 32 characters' });
        }

        // Check if username exceeds the maximum length
        if (username && username.length > 20) {
            return res.status(400)
                .json({ message: 'username field must not exceed 20 characters' });
        }

        // Format the username by removing whitespace and converting to lowercase
        const formattedUserName = username ? username.trim().replace(/\s/g, '').toLowerCase() : undefined;

        // Check if the formatted username already exists for another user
        if (formattedUserName && formattedUserName === user.username && (await User.findOne({ username: formattedUserName }))) {
            return res.status(400).json({ message: 'username already exists, choose a different username' });
        }

        // Check if the email is invalid
        if (email && !isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        // Check if the email already exists for another use
        if (email && email === user.email && (await User.findOne({ email }))) {
            return res.status(400).json({ message: 'email already exists, choose a different email' });
        }

        // Format the password by removing whitespace
        const formattedPassword = password ? password.trim() : undefined;

        // Check if the password length is less than 6 characters
        if (formattedPassword && formattedPassword.length < 6) {
            return res.status(400).json({ message: 'enter at least 6 characters for the password' });
        }

        // Update the user with the provided data
        const updateUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname,
                surname,
                username: formattedUserName,
                email,
                password: formattedPassword,
                profilePicture: profilePicturePath,
            },
            { new: true }
        );

        // Handle if user is not modified
        if (!updateUser) return res.status(304).json({ message: 'user is not modified' });

        // Set the response headers and send the success message
        res.header('Content-Type', 'application/json');
        res.status(200).json({ message: `user with ID ${_id} was modified` });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Delete a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing a success message or an error message.
 */
async function httpDeleteUser(req, res) {
    try {
        const { _id } = req.user;

        // Find the user by ID
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ message: 'user not found' });

        // Delete the user
        const deletedUser = await User.deleteOne({ _id });

        // Handle if no user was deleted
        if (deletedUser.deletedCount === 0) return res.status(417)
            .json({ message: 'Expectation Failed' });

        // Set the response headers and send the success message
        res.header('Content-Type', 'application/json');
        res.status(200).json({ message: `user with ID ${_id} was deleted` });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

module.exports = {
    httpGetUsers,
    httpGetUserByID,
    httpGetUsersCount,
    httpUpdateUser,
    httpDeleteUser
}