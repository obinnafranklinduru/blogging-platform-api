const request = require('supertest');

const app = require('../../app');
const User = require('../../models/users.model');
const { mongooseConnect, mongooseDisconnect } = require('../../utils/mongoose');

describe('User Routes Endpoints', () => {
    let authToken;
    let user;

    beforeAll(async () => {
        await mongooseConnect()

        user = await User.create({
            username: 'testadmin',
            email: 'testadmin@example.com',
            password: 'password',
            isAdmin: true
        });

        const login = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'testadmin@example.com', password: 'password' });
            
        authToken = login.body.accessToken;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongooseDisconnect()
    });

    describe('GET /api/v1/users', () => {
        it('should return an object of users', async () => {
            const response = await request(app).get('/api/v1/users');
            expect(response.status).toBe(200);
            expect(typeof response.body.users).toBe('object');
        });
    });

    describe('GET /api/v1/users/:id', () => {
        it('should require authentication', async () => {
            const response = await request(app).get('/api/v1/users/1');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should require valid Id', async () => {
            const response = await request(app)
                .get('/api/v1/users/1')
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid ID');
        });

        it('should return a user by ID when authenticated', async () => {
            const response = await request(app)
                .get(`/api/v1/users/${user._id}`)
                .set('Authorization', `Bearer ${authToken}`)
            
            expect(response.status).toBe(200);
            expect(typeof response.body.user).toBe('object');
        });
    });

    describe('GET /api/v1/users/get/count', () => {
        it('should require authentication', async () => {
            const response = await request(app).get('/api/v1/users/get/count');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should return the total number of users', async () => {
            const response = await request(app)
                .get('/api/v1/users/get/count')
                .set('Authorization', `Bearer ${authToken}`)
            
            expect(response.status).toBe(200);
            expect(typeof response.body.usersCount).toBe('number');
        });
    });

    describe('PUT /api/v1/users', () => {
        it('should require authentication', async () => {
            const response = await request(app).put('/api/v1/users');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should update a user', async () => {
            const updateUser = { firstname: 'John', surname: 'Doe' };

            const response = await request(app)
                .put('/api/v1/users')
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateUser);

            expect(response.status).toBe(200);
            expect(response.body.message).toBeDefined();
           
        });
    })

    describe('DELETE /api/v1/users', () => {
        it('should require authentication', async () => {
            const response = await request(app).delete('/api/v1/users');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should delete a user', async () => {
            const response = await request(app)
                .delete('/api/v1/users')
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBeDefined();
        });
    });
});