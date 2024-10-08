import request from 'supertest';
import { startServer, app } from '../src/index';
import { User } from '../src/models/User';
import { Publication, Comment } from '../src/models/Publication';

beforeAll(async () => {
    await startServer(3001);
});

afterAll(async () => {
    await User.deleteMany({});
    await Publication.deleteMany({});
});

describe('Publications API', () => {
    let userId: string | unknown;

    beforeAll(async () => {
        const user = new User({ name: 'John Doe', email: 'john@example.com', password: 'password' });
        const savedUser = await user.save();
        userId = savedUser._id;
    });

    describe('POST /publications/create', () => {
        it('Create a new publication', async () => {
            const response = await request(app).post('/publications/create').send({
                author: userId,
                title: 'My first publication',
                description: 'This is my first publication',
                comments: []
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Publication created');
            expect(response.body).toHaveProperty('title', 'My first publication');
        });

        it('Fail to create a publication due to missing fields', async () => {
            const response = await request(app).post('/publications/create').send({
                author: userId,
                title: 'My first publication'
            });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Please fill all fields');
        });

        it('Fail to create a publication with a non-existing user', async () => {
            const response = await request(app).post('/publications/create').send({
                author: "60b8c5f51c4d5c7c4c1d0e7b",
                title: 'My first publication',
                description: 'This is my first publication',
                comments: []
            });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'User not found');
        });
    });

    describe('GET /publications', () => {
        it('Get all publications', async () => {
            const response = await request(app).get('/publications');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('POST /publications/:id/comments/create', () => {
        let publicationId: string | unknown;

        beforeAll(async () => {
            const publication = new Publication({
                author: userId,
                title: 'My first publication',
                description: 'This is my first publication',
                comments: []
            });
            const savedPublication = await publication.save();
            publicationId = savedPublication._id;
        });

        it('Create a new comment', async () => {
            const response = await request(app).post(`/publications/${publicationId}/comments/create`).send({
                author: userId,
                content: 'This is my first comment',
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Comment added');
            expect(response.body.comment).toHaveProperty('content', 'This is my first comment');
        });

        it('Fail to create a comment due to missing fields', async () => {
            const response = await request(app).post(`/publications/${publicationId}/comments/create`).send({
                author: userId
            });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Please fill all fields');
        });

        it('Fail to create a comment on a non-existing publication', async () => {
            const response = await request(app).post('/publications/60b8c5f51c4d5c7c4c1d0e7b/comments/create').send({
                author: userId,
                content: 'This comment should fail',
            });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Publication not found');
        });
    });

    describe('POST /publications/:id/comments/:commentId/replies/create', () => {
        let publicationId: string | unknown;
        let commentId: string | unknown;

        beforeAll(async () => {
            const publication = new Publication({
                author: userId,
                title: 'My first publication',
                description: 'This is my first publication',
                comments: []
            });
            const savedPublication = await publication.save();
            publicationId = savedPublication._id;

            const comment = new Comment({
                author: userId,
                content: 'This is my first comment',
                createdAt: new Date(),
                replies: []
            });
            savedPublication.comments.push(comment);
            await savedPublication.save();
            commentId = savedPublication.comments[0]._id;
        });

        it('Create a new reply to a comment', async () => {
            const response = await request(app).post(`/publications/${publicationId}/comments/${commentId}/replies/create`).send({
                author: userId,
                content: 'This is a reply to the comment',
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Reply added');
        });

        it('Fail to create a reply due to missing fields', async () => {
            const response = await request(app).post(`/publications/${publicationId}/comments/${commentId}/replies/create`).send({
                author: userId
            });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Please fill all fields');
        });

        it('Fail to create a reply on a non-existing comment', async () => {
            const response = await request(app).post(`/publications/${publicationId}/comments/invalidCommentId/replies/create`).send({
                author: userId,
                content: 'This reply should fail'
            });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Comment not found');
        });

        it('Fail to create a reply on a non-existing publication', async () => {
            const response = await request(app).post(`/publications/60b8c5f51c4d5c7c4c1d0e7b/comments/${commentId}/replies/create`).send({
                author: userId,
                content: 'This reply should fail'
            });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Publication not found');
        });
    });
});