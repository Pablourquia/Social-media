import request from 'supertest';
import { startServer, app } from '../src/index';
import { User } from '../src/models/User';
import { Message } from '../src/models/Message';


beforeAll(async () => {
    await startServer(3003);
});

afterAll(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
});

describe ('Messages API', () => {
    let userId: string | unknown;
    let addresseeId: string | unknown;

    beforeAll(async () => {
        const user = new User({ name: 'John Doe', email: 'user@gmail.com', password: '1234' });
        const savedUser = await user.save();
        userId = savedUser._id;
        const addressee = new User({ name: 'Jane Doe', email: 'user1@gmail.com', password: '1234' });
        const savedAddressee = await addressee.save();
        addresseeId = savedAddressee._id;
    });

    describe('POST /messages/create', () => {
        it('Create a new message', async () => {
            const response = await request(app).post('/messages/create').send({
                sender: userId,
                content: 'Hello',
                addressee: addresseeId
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Message created');
            expect(response.body).toHaveProperty('content', 'Hello');
        });
        it('Fail to create a message due to missing fields', async () => {
            const response = await request(app).post('/messages/create').send({
                sender: userId,
                content: 'Hello'
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Please fill all fields');
        });
        it('Fail to create a message with a non-existing user', async () => {
            const response = await request(app).post('/messages/create').send({
                sender: "60b8c5f51c4d5c7c4c1d0e7b",
                content: 'Hello',
                addressee: addresseeId
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'User not found');
        });
        it('Fail to create a message with a non-existing addressee', async () => {
            const response = await request(app).post('/messages/create').send({
                sender: userId,
                content: 'Hello',
                addressee: "60b8c5f51c4d5c7c4c1d0e7b"
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'User not found');
        });
    })

    it ('GET /messages/:id', async () => {
        const response = await request(app).get(`/messages/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('my_messages');
        expect(response.body).toHaveProperty('messages_for_me');
    });
});
