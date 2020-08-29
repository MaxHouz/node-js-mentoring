import { IUserFull, ICreateUserBody, IUpdateUserBody, IUserSafeData } from '../models/user.model';
import { v4 as uuid4 } from 'uuid';
import { users } from './users-storage';

export function addUser(userData: ICreateUserBody): string {
    const id = uuid4();
    users[id] = { id, ...userData };

    return id;
}

export function updateUser(user: IUserFull, updatedUserData: IUpdateUserBody): void {
    const { id } = user;
    users[id] = { ...user, ...updatedUserData };
}

export function deleteUser(id: string): void {
    delete users[id];
}

export function softDeleteUser(user: IUserFull): void {
    const { id } = user;
    users[id] = { ...user,  isDeleted: true };
}

export function restoreUser(user: IUserFull) {
    const { id } = user;
    users[id] = { ...user,  isDeleted: false };
}

export function getUser(id: string): IUserFull {
    return users[id];
}

export function getAllUsers(): { [key: string]: IUserFull } {
    return users;
}

export function getAutoSuggestUsers(loginSubstring: string, limit: number): IUserSafeData[] {
    return Object.keys(users)
        .filter(id => !users[id].isDeleted && users[id].login.toLowerCase().includes(loginSubstring.toLowerCase()))
        .map(id => {
            const { login, age } = users[id];
            return { id, login, age };
        })
        .sort((a, b) => a.login.localeCompare(b.login))
        .slice(0, limit);
}
