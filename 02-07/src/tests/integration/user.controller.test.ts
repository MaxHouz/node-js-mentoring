import request from 'supertest';
import { app } from '../../app';
import { ErrorMessages } from '../../services/error-handling.utils';
import { deleteUser, getUserResponse, registerUser, restoreUser } from '../test-helpers';

describe('userController', () => {
    const userData = {
        login: 'UserControllerTest',
        age: 30,
        password: 'string7909ds7J'
    };

    let jwt: string;
    let userId: string;

    beforeAll((done) => {
        registerUser(userData)
            .then(({ id, token }) => {
                jwt = token;
                userId = id;
                done();
            })
    })

    describe('GET /user/:id', () => {
        it('should get user by id', async () => {
            const res = await getUserResponse(userId, jwt);

            const { login, age } = userData;

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                login,
                age,
                id: userId
            })
        });

        it('should block unauthorized requests', async () => {
            const res = await request(app)
                .get(`/user/${userId}`)

            expect(res.status).toBe(401);
            expect(res.body.error).toBe(ErrorMessages.unauthorized);
        });
    });

    describe('PUT /user/:id', () => {
        it('should update user data', async () => {
            await request(app)
                .put(`/user/${userId}`)
                .set({ 'x-auth-token': jwt })
                .send({ age: 40 })

            const res = await getUserResponse(userId, jwt);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id: userId, age: 40, login: userData.login });
        });

        it('should block unauthorized requests', async () => {
            const res = await request(app)
                .put(`/user/${userId}`)

            expect(res.status).toBe(401);
            expect(res.body.error).toBe(ErrorMessages.unauthorized);
        });
    });

    describe('DELETE /user/:id', () => {
        it('should soft delete user', async () => {
            await deleteUser(userId, jwt, true);
            const res = await getUserResponse(userId, jwt);

            expect(res.status).toBe(400);
            expect(res.body.error).toBe(ErrorMessages.softlyDeletedUser);

            await restoreUser(userId, jwt);
        });

        it('should delete user completely', async () => {
            await deleteUser(userId, jwt, false);
            const res = await getUserResponse(userId, jwt);

            expect(res.status).toBe(404);
            expect(res.body.error).toBe(ErrorMessages.userNotFound);

            const newUser = await registerUser(userData);
            jwt = newUser.token;
            userId = newUser.id;
        });

        it('should block unauthorized requests', async () => {
            const res = await request(app)
                .put(`/user/${userId}`)

            expect(res.status).toBe(401);
            expect(res.body.error).toBe(ErrorMessages.unauthorized);
        });
    });

    describe('GET /user/auto-suggest', () => {
        const secondUserData = {
            login: 'UserControllerTest2',
            age: 30,
            password: 'string7909ds7df$J'
        };
        let secondUserId: string;

        beforeEach((done) => {
            registerUser(secondUserData)
                .then(({ id }) => {
                    secondUserId = id;
                    done();
                })
        });

        afterEach((done) => {
            deleteUser(secondUserId, jwt, false).then(() => done());
        });

        it('should return users with matching login', async () => {
            const res = await request(app)
                .get(`/user/auto-suggest?value=${secondUserData.login}`)
                .set({ 'x-auth-token': jwt });

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].id).toBe(secondUserId);
        });

        it('should return limited list of users with matching login', async () => {
            const res = await request(app)
                .get(`/user/auto-suggest?value=UserController&limit=1`)
                .set({ 'x-auth-token': jwt });

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });

        it('should block unauthorized requests', async () => {
            const res = await request(app)
                .get('/user/auto-suggest');

            expect(res.status).toBe(401);
            expect(res.body.error).toBe(ErrorMessages.unauthorized);
        });
    });

    describe('PATCH /user/restore', () => {
        it('should restore softly deleted users', async () => {
            await deleteUser(userId, jwt, true);
            await restoreUser(userId, jwt);
            const res = await getUserResponse(userId, jwt);

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(userId);
        });

        it('should block unauthorized requests', async () => {
            const res = await request(app)
                .patch(`/user/restore${userId}`);

            expect(res.status).toBe(401);
            expect(res.body.error).toBe(ErrorMessages.unauthorized);
        });
    });

    describe('POST /user/login', () => {
        it('should login user', async () => {
            const { login, password } = userData;
            const res = await request(app)
                .post('/user/login')
                .send({ login, password });

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(userId);
            expect(res.body.token).toBeTruthy();
        });

        it('should validate user password', async () => {
            const { login } = userData;
            const res = await request(app)
                .post('/user/login')
                .send({ login, password: 'InvalidPassword33' });

            expect(res.status).toBe(403);
            expect(res.body.error).toBe(ErrorMessages.invalidPassword);
        });
    });
})
