import { createGroupResponse, registerUser } from '../test-helpers';
import { GroupPermission } from '../../types/group.interface';
import request from 'supertest';
import { app } from '../../app';
import { ErrorMessages } from '../../services/error-handling.utils';

describe('groupController', () => {
    const userData = {
        login: 'UserGroupTest',
        age: 30,
        password: 'string7909ds7J'
    };
    const groups = [
        {
            id: '',
            name: 'First group',
            permissions: [GroupPermission.read, GroupPermission.write]
        },
        {
            id: '',
            name: 'Second group',
            permissions: [GroupPermission.read, GroupPermission.share]
        },
        {
            id: '',
            name: 'Third group',
            permissions: [GroupPermission.read, GroupPermission.share, GroupPermission.write, GroupPermission.delete]
        }
    ];

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

    beforeAll((done) => {
        Promise.all(
            groups.map(async (group) => {
                const { name, permissions } = group;
                const res = await createGroupResponse({ name, permissions }, jwt)
                group.id = res.body.id;
                return group;
            })
        ).then(() => done())
    })

    describe('GET /group/get-all', () => {
        it('should return all groups', async () => {
            const res = await request(app)
                .get('/group/get-all')
                .set({ 'x-auth-token': jwt });

            expect(res.status).toBe(200);
            expect(res.body.groups).toStrictEqual(groups);
        });

        it('should block unauthorized requests', async () => {
            const res = await request(app)
                .get('/group/get-all')

            expect(res.status).toBe(401);
            expect(res.body.error).toBe(ErrorMessages.unauthorized);
        });
    });
});
