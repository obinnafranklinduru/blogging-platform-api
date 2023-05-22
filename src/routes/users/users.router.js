const usersRouter = require('express').Router();

const { authToken } = require('../../middleware/auth');
const { uploads } = require('../../utils/multer');
const {
    httpGetUsers,
    httpGetUserByID,
    httpGetUsersCount,
    httpUpdateUser,
    httpDeleteUser
} = require('./users.controller')

// Get users in our platform (Public)
usersRouter.get('/', httpGetUsers);
// Get specific users in our platform (Private)
usersRouter.get('/:id', authToken, httpGetUserByID);
// Get total users number in the platform (Private)
usersRouter.get('/get/count', authToken, httpGetUsersCount);
// User update themselves (Private)
usersRouter.put('/', authToken, uploads.single('profilePicture'), httpUpdateUser);
// User revoke their account (Private)
usersRouter.delete('/', authToken, httpDeleteUser);

module.exports = usersRouter;