import request from 'supertest';
import { startServer, app } from '../src/index';
import { User } from '../src/models/User';

beforeAll(async () => {
    startServer(3002);
});

afterAll(async () => {
    await User.deleteMany({});
});


describe('Users API', () => {
    describe('POST /users/create', () => {
        it('Create a new user', async () => {
            const response = await request(app).post('/users/create').send({
                name: 'John Doe',
                email: 'prueba@gmail.com',
                password: '1234'
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
        });
        it('Fail to create a new user', async () => {
            const response = await request(app).post('/users/create').send({
                name: 'John Doe',
                email: 'prueba@gmail.com',
                password: '1234'
            });
            expect(response.status).toBe(402);
            expect(response.body).toHaveProperty('message', 'User already exists');
        });
        it('Fail for not filling all fields', async () => {
            const response = await request(app).post('/users/create').send({
                name: 'John Doe',
                email: 'prueba@gmail.com'
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Please fill all fields');
        });
    });
    
    describe('POST /users/login', () => {
        it('Login a user', async () => {
            const response = await request(app).post('/users/login').send({
                email: 'prueba@gmail.com',
                password: '1234'
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });
        it('Fail to login a user', async () => {
            const response = await request(app).post('/users/login').send({
                email: 'prueba@gmail.com',
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Please fill all fields');
        });
        it('Fail to login a user', async () => {
            const response = await request(app).post('/users/login').send({
                email: 'prueba1@gmail.com',
                password: '1234'
            });
            expect(response.status).toBe(402);
            expect(response.body).toHaveProperty('message', 'User not found');
        });
        it('Fail to login a user', async () => {
            const response = await request(app).post('/users/login').send({
                email: 'prueba@gmail.com',
                password: '12345'
            });
            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('message', 'Invalid password');
        });
    });
});

