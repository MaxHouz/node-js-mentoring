import { ICreateUserBody, IUpdateUserBody, IUserSafeData, IUserModel } from '../types/user.interface';
import { v4 as uuid4 } from 'uuid';
import { userRepositoryService, UserRepositoryService } from '../data-access/userRepositoryService';
import { logAsyncMethodErrors } from './error-handling.utils';

export class UserService {
    constructor(
        private readonly userRepository: UserRepositoryService
    ) {}

    @logAsyncMethodErrors('userService.addUser')
    public async addUser(userData: ICreateUserBody): Promise<string> {
        const id = uuid4();
        return await this.userRepository.insertUser({ id, isDeleted: false, ...userData });
    }

    @logAsyncMethodErrors('userService.getAutoSuggestUsers')
    public async getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<IUserSafeData[]> {
        return await this.userRepository.findLoginMatch(loginSubstring, limit);
    }

    @logAsyncMethodErrors('userService.isLoginUsed')
    public async isLoginUsed(login: string): Promise<boolean> {
        return !!await this.userRepository.findUser('login', login);
    }

    @logAsyncMethodErrors('userService.getUserById')
    public async getUserById(id: string): Promise<IUserModel> {
        return await this.userRepository.findUser('id', id).catch(_ => null);
    }

    @logAsyncMethodErrors('userService.getUserByLogin')
    public async getUserByLogin(login: string): Promise<IUserModel> {
        return await this.userRepository.findUser('login', login).catch(_ => null);
    }

    @logAsyncMethodErrors('userService.updateUser')
    public async updateUser(id: string, updatedUserData: IUpdateUserBody): Promise<void> {
        await this.userRepository.updateUser(id, updatedUserData);
    }

    @logAsyncMethodErrors('userService.deleteUser')
    public async deleteUser(id: string, softDelete = false): Promise<void> {
        if (softDelete) {
            await this.userRepository.updateUser(id, { isDeleted: true });
        } else {
            await this.userRepository.deleteUser(id);
        }
    }

    @logAsyncMethodErrors('userService.restoreUser')
    public async restoreUser(id: string): Promise<void> {
        await this.userRepository.updateUser(id, { isDeleted: false });
    }
}

export const userService = new UserService(userRepositoryService);

