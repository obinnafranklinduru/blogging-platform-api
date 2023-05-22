const authRouter = require('express').Router();

const { authToken } = require('../../middleware/auth');
const {
    httpRegisterUser,
    httpRegisterAdmin,
    httpLoginUser,
    httpLogoutUser
} = require('./auth.controller');

// Sign up or open an account (Public)
authRouter.post('/register/user', httpRegisterUser);

authRouter.post('/register/admin', httpRegisterAdmin);

// Sign in and gain access to more information (Public)
authRouter.post('/login', httpLoginUser);

// Sign out and logout (Private)
authRouter.get('/logout', authToken, httpLogoutUser);

module.exports = authRouter;