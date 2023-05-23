const request = require('supertest');

const app = require('../../../app');
const User = require('../../models/users.model');
const TokenBlacklist = require('../../models/tokenblacklist.model');
const { mongooseConnect, mongooseDisconnect } = require('../../utils/mongoose');

describe('Authentication Endpoints', () => {
    beforeAll(async () => await mongooseConnect());

    afterAll(async () => {
        await TokenBlacklist.deleteMany({});
        await User.deleteMany({});

        await mongooseDisconnect()
    });

    describe('POST /api/v1/auth/register/user', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/user')
                .send({
                    username: 'testuser',
                    email: 'testuser@example.com',
                    password: 'password',
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBeDefined();
        });
   
        it('should hash password before saving', async () => {
            const user = await User.findOne({ email: 'testuser@example.com' });

            expect(user.password).not.toBe('password');
        });

        it('should throw validation errors if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/user')
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Please provide username, email and password');
        });

        it('should throw validation errors if email is invalid', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/user')
                .send({
                    username: 'testuser',
                    email: 'invalidemail',
                    password: 'password'
                });
            
            expect(response.status).toBe(400);
            expect(response.error).toBeDefined();
        });

        it('should throw validation errors if email is not unique', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/user')
                .send({
                    username: 'newuser',
                    email: 'testuser@example.com',
                    password: 'password',
                });

            expect(response.status).toBe(400);
            expect(response.error).toBeDefined();
        });

        it('should throw validation errors if username is not unique', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/user')
                .send({
                    username: 'testuser',
                    email: 'newuser@example.com',
                    password: 'password',
                });

            expect(response.status).toBe(400);
            expect(response.error).toBeDefined();
        });

        it('should throw validation errors if password is short', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/user')
                .send({
                    username: 'newuser',
                    email: 'newuser@example.com',
                    password: 'short',
                });

            expect(response.status).toBe(400);
            expect(response.error).toBeDefined();
        });

        it('should create user with default Admin Status if not provided', async () => {
            const user = await User.findOne({ email: 'testuser@example.com' });

            expect(user.isAdmin).toBe(false);
        });
    });

    describe('POST /api/v1/auth/register/admin', () => {
        it('should register a new admin', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/admin')
                .send({
                    username: 'testadmin',
                    email: 'testadmin@example.com',
                    password: 'password',
                    isAdmin: true
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBeDefined();
        });
   
        it('should hash password before saving', async () => {
            const user = await User.findOne({ email: 'testuser@example.com' });

            expect(user.password).not.toBe('password');
        });

        it('should throw validation errors if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/admin')
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Please provide username, email, admin status and password');
        });

        it('should throw validation errors if admin status is false ', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/admin')
                .send({
                    username: 'testadmin',
                    email: 'testadmin@example.com',
                    password: 'password',
                    isAdmin: false
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Please set admin status to true');
        });

        it('should throw validation errors if email is invalid', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/admin')
                .send({
                    username: 'testadmin',
                    email: 'invalidemail',
                    password: 'password',
                    isAdmin: true
                });
            
            expect(response.status).toBe(400);
            expect(response.error).toBeDefined();
        });

        it('should throw validation errors if email is not unique', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/admin')
                .send({
                    username: 'newadmin',
                    email: 'testadmin@example.com',
                    password: 'password',
                    isAdmin: true
                });

            expect(response.status).toBe(400);
            expect(response.error).toBeDefined();
        });

        it('should throw validation errors if username is not unique', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/admin')
                .send({
                    username: 'testadmin',
                    email: 'newadmin@example.com',
                    password: 'password',
                });

            expect(response.status).toBe(400);
            expect(response.error).toBeDefined();
        });

        it('should throw validation errors if password is short', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register/admin')
                .send({
                    username: 'newadmin',
                    email: 'newadmin@example.com',
                    password: 'short',
                });

            expect(response.status).toBe(400);
            expect(response.error).toBeDefined();
        });

        it('should create user with Admin Status set to true', async () => {
            const user = await User.findOne({ email: 'testadmin@example.com' });

            expect(user.isAdmin).toBe(true);
        });
    })

    describe('POST /api/v1/auth/login', () => {
        it('should return an auth token for a valid login with email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testadmin@example.com', password: 'password' });
            
            expect(response.status).toEqual(200);
            expect(response.body.accessToken).toBeDefined();
        });

        it('should return an auth token for a valid login with username', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ username: 'testadmin', password: 'password' });
            
            expect(response.status).toEqual(200);
            expect(response.body.accessToken).toBeDefined();
        });

        it('should return an error for an invalid login with password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'wrongpassword' });
            
            expect(res.status).toEqual(401);
            expect(res.body.message).toEqual('Incorrect credentials');
        });

        it('should return an error for an invalid login with email', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'wrong@example.com', password: 'password' });
            
            expect(res.status).toEqual(401);
            expect(res.body.message).toEqual('Incorrect credentials');
        });

        it('should return an error for an invalid login with username', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ username: 'wrongusername', password: 'password' });
            
            expect(res.status).toEqual(401);
            expect(res.body.message).toEqual('Incorrect credentials');
        });
    });
    
    describe('GET /api/v1/auth/logout', () => {
        it('should blacklist the auth token for the current user', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
            
            const authToken = response.body.accessToken;

            const res = await request(app)
                .get('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${authToken}`)
            
            expect(res.status).toEqual(200);
            expect(res.body.message).toEqual('Logout successful');

            const tokenblacklisted = await TokenBlacklist.findOne({ token: authToken });
            expect(tokenblacklisted.token).toBe(authToken);
        });

        it('should return an error if no auth token is provided', async () => {
            const response = await request(app).get('/api/v1/auth/logout');
            expect(response.status).toEqual(401);
            expect(response.body.message).toBe('Unauthorized');
        });
    });
});