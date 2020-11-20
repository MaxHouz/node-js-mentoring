import request from 'supertest';
import { app } from '../app';
import { ICreateUserBody } from '../types/user.interface';
import { ICreateGroupBody } from '../types/group.interface';

export function getUserResponse(id: string, token: string) {
    return request(app)
        .get(`/user/${id}`)
        .set({ 'x-auth-token': token });
}

export async function registerUser(userData: ICreateUserBody): Promise<{ id: string, token: string }> {
    const res = await request(app)
        .post('/user/register')
        .send(userData);
    const { id, token } = res.body;
    return { id, token };
}

export async function restoreUser(id: string, token: string): Promise<void> {
    await request(app)
        .patch(`/user/restore/${id}`)
        .set({ 'x-auth-token': token });
}

export async function deleteUser(id: string, token: string, soft: boolean): Promise<void> {
    await request(app)
        .delete(`/user/${id}?soft=${soft}`)
        .set({ 'x-auth-token': token });
}

export function createGroupResponse(groupData: ICreateGroupBody, token: string) {
    return request(app)
        .post(`/group/create`)
        .set({ 'x-auth-token': token })
        .send(groupData);
}
