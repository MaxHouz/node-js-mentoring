import { Model } from 'sequelize';

export interface IUserSafeData {
    id: string;
    login: string;
    age: number;
}

export interface IUserAttributes extends IUserSafeData {
    password: string;
    isDeleted?: boolean;
}

export interface ICreateUserBody {
    login: string;
    password: string;
    age: number;
}

export interface IUpdateUserBody {
    login?: string;
    password?: string;
    age?: number;
    isDeleted?: boolean;
}

export interface IUserModel extends Model<IUserAttributes>, IUserAttributes {}

