const authRouter = require('express').Router();

const { authToken } = require('../../middleware/auth');
const {
    httpRegisterUser,
    httpRegisterAdmin,
    httpLoginUser,
    httpLogoutUser
} = require('./auth.controller');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 * 
 * components:
 *   schemas:
 *     RegisterUserRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Username of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         password:
 *           type: string
 *           format: password
 *           description: Password of the user
 *       required:
 *         - username
 *         - email
 *         - password
 *
 *     RegisterUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *
 *     RegisterAdminRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Username of the admin
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the admin
 *         password:
 *           type: string
 *           format: password
 *           description: Password of the admin
 *         isAdmin:
 *           type: boolean
 *           description: Admin status (true/false)
 *       required:
 *         - username
 *         - email
 *         - password
 *         - isAdmin
 *
 *     RegisterAdminResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *
 *     LoginRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Username of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         password:
 *           type: string
 *           format: password
 *           description: Password of the user
 *       required:
 *         - password
 *       oneOf:
 *         - required:
 *           - username
 *         - required:
 *           - email
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Access token for authentication
 *
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 */

/**
 * @swagger
 * /api/v1/auth/register/user:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterUserResponse'
 */
authRouter.post('/register/user', httpRegisterUser);

/**
 * @swagger
 * /api/v1/auth/register/admin:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAdminRequest'
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterAdminResponse'
 */
authRouter.post('/register/admin', httpRegisterAdmin);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 */
authRouter.post('/login', httpLoginUser);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   get:
 *     tags: [Authentication]
 *     summary: Logout a user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 */
authRouter.get('/logout', authToken, httpLogoutUser);

module.exports = authRouter;