const request = require('supertest');
const createServer = require('../../server')
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const server = createServer;
const JWT_KEY = process.env.JWT_KEY;

describe('tests unitaires', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/apinodecommenttest', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    let post_id;
    let comment_id;
    const dataToSign = { postId: '123' };

    it('createAPost', async () => {

        const posts = [
            {
                title: 'newPost',
            }
        ];

        const token = jwt.sign(dataToSign, JWT_KEY);

        const response = await request(server)
            .post('/posts')
            .set('Authorization', token)
            .send(posts[0]);

        expect(response.status).toEqual(201);
    })

    it('listAllPosts', async () => {

        const response = await request(server)
            .get('/posts');

        expect(response.status).toEqual(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].title).toBe('newPost');
        post_id = response.body[0]._id;
    })

    it('createAComment', async () => {

        const comment = [
            {
                name: 'commentaire',
                message: 'message',
            }
        ]
        const response = await request(server)
            .post(`/posts/${post_id}/comments`)
            .send(comment[0]);

        expect(response.status).toEqual(201);
    })

    it('listAllComments', async () => {

        const response = await request(server)
            .get(`/posts/${post_id}/comments`);

        expect(response.status).toEqual(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].name).toBe('commentaire');
        comment_id = response.body[0]._id;
    })

    it('updateAComment', async () => {

        const response = await request(server)
            .put(`/comments/${comment_id}`)
            .send({ name: 'name_changé' })

        expect(response.status).toEqual(200);
    })

    it('getAComment', async () => {

        const response = await request(server)
            .get(`/comments/${comment_id}`)

        expect(response.status).toEqual(200);
        expect(response.body.name).toBe('name_changé');
    })

    it('deleteAComment', async () => {

        const response = await request(server)
            .delete(`/comments/${comment_id}`)

        expect(response.status).toEqual(200);
    })
})