import { User } from '../models/user.model';
import { IUpdateUserBody, IUserAttributes, IUserModel, IUserSafeData } from '../types/user.interface';
import { ModelCtor, Op } from 'sequelize';

export class UserRepositoryService {
    constructor(
        private readonly userModel: ModelCtor<IUserModel>
    ) {}

    public async insertUser(userData: IUserAttributes): Promise<string> {
        const user = await this.userModel.create(userData);
        return user.id;
    }

    public async findUser(attribute: string, value: string): Promise<IUserModel> {
        return await this.userModel.findOne({
            where: { [attribute]: value }
        });
    }

    public async updateUser(id: string, userData: IUpdateUserBody): Promise<void> {
        await this.userModel.update(userData, {
            where: { id }
        })
    }

    public async deleteUser(id: string): Promise<void> {
        await this.userModel.destroy({
            where: { id }
        })
    }

    public async findLoginMatch(loginSubstr: string, limit: number): Promise<IUserSafeData[]> {
        return await this.userModel.findAll({
            where: {
                login: {
                    [Op.iLike]: `%${loginSubstr}%`
                }
            },
            order: [
                ['login', 'ASC']
            ],
            limit,
            attributes: [
                'id', 'login', 'age'
            ]
        });
    }
}

export const userRepositoryService = new UserRepositoryService(User);
