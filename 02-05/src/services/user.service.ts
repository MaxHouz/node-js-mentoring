import { ICreateUserBody, IUpdateUserBody, IUserSafeData, IUserModel } from '../types/user.interface';
import { v4 as uuid4 } from 'uuid';
import { userRepositoryService, UserRepositoryService } from '../data-access/userRepositoryService';

export class UserService {
    constructor(
        private readonly userRepository: UserRepositoryService
    ) {}

    public async addUser(userData: ICreateUserBody): Promise<string> {
        const id = uuid4();
        return await this.userRepository.insertUser({ id, isDeleted: false, ...userData });
    }

    public async getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<IUserSafeData[]> {
        return await this.userRepository.findLoginMatch(loginSubstring, limit);
    }

    public async isLoginUsed(login: string): Promise<boolean> {
        return !!await this.userRepository.findUser('login', login);
    }

    public async getUserById(id: string): Promise<IUserModel> {
        return await this.userRepository.findUser('id', id).catch(_ => null);
    }

    public async updateUser(id: string, updatedUserData: IUpdateUserBody): Promise<void> {
        await this.userRepository.updateUser(id, updatedUserData);
    }

    public async deleteUser(id: string, softDelete = false): Promise<void> {
        if (softDelete) {
            await this.userRepository.updateUser(id, { isDeleted: true });
        } else {
            await this.userRepository.deleteUser(id);
        }
    }

    public async restoreUser(id: string): Promise<void> {
        await this.userRepository.updateUser(id, { isDeleted: false });
    }
}

export const userService = new UserService(userRepositoryService);

