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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users endpoints
 *  
 * components:
 *   schemas:
 *     UpdateUserRequest:
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
 *         firstname:
 *           type: string
 *           description: First name of the user
 *         surname:
 *           type: string
 *           description: Surname of the user
 *         profilePicture:
 *           type: string
 *           format: binary
 *           pattern: ".*\\.(jpg|jpeg|png)$"
 *           description: Profile picture
 * 
 *     UserMultipleResponse:
 *       type: object
 *       properties:
 *         users:
 *           type: array
 *           items:
 *              type: object
 *              description: Users object
 * 
 *     UserSingleResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           description: User object
 * 
 *     UserCountResponse:
 *       type: object
 *       properties:
 *         usersCount:
 *           type: number
 *           description: Users count
 *              
 */ 

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Retrieve all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMultipleResponse'
 */
usersRouter.get('/', httpGetUsers);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSingleResponse'
 */
usersRouter.get('/:id', authToken, httpGetUserByID);

/**
 * @swagger
 * /api/v1/users/get/count:
 *   get:
 *     tags: [Users]
 *     summary: Get the count of users
 *     responses:
 *       200:
 *         description: The count of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCountResponse'
 */
usersRouter.get('/get/count', authToken, httpGetUsersCount);

/**
 * @swagger
 * /api/v1/users:
 *   put:
 *     tags: [Users]
 *     summary: Update a user
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
usersRouter.put('/', authToken, uploads.single('profilePicture'), httpUpdateUser);

/**
 * @swagger
 * /api/v1/users:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
usersRouter.delete('/', authToken, httpDeleteUser);

module.exports = usersRouter;