import {
    Model,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyAddAssociationMixin
} from 'sequelize';
import { IUserModel } from './user.interface';

export enum GroupPermission {
    read = 'READ',
    write = 'WRITE',
    delete = 'DELETE',
    share = 'SHARE',
    uploadFiles = 'UPLOAD_FILES'
}

export interface IUpdateGroupBody {
    name?: string;
    permissions?: GroupPermission[];
}

export interface ICreateGroupBody {
    name: string;
    permissions: GroupPermission[];
}

export interface IGroupAttributes extends ICreateGroupBody {
    id: string;
}

export interface IGroupModel extends Model<IGroupAttributes>, IGroupAttributes {
    getUser: BelongsToManyGetAssociationsMixin<IUserModel>,
    addUser: BelongsToManyAddAssociationMixin<IUserModel, IUserModel['id']>
}
