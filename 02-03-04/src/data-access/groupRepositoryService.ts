import { ModelCtor } from 'sequelize';
import { IGroupAttributes, IGroupModel, IUpdateGroupBody } from '../types/group.interface';
import { Group } from '../models/group.model';

export class GroupRepositoryService {
    constructor(
        private readonly groupModel: ModelCtor<IGroupModel>
    ) {}

    public async insertGroup(groupData: IGroupAttributes): Promise<string> {
        const group = await this.groupModel.create(groupData);
        return group.id;
    }

    public async findGroup(attribute: string, value: string): Promise<IGroupModel> {
        return await this.groupModel.findOne({
            where: { [attribute]: value }
        });
    }

    public async updateGroup(id: string, groupData: IUpdateGroupBody): Promise<void> {
        await this.groupModel.update(groupData, {
            where: { id }
        })
    }

    public async deleteGroup(id: string): Promise<void> {
        await this.groupModel.destroy({
            where: { id }
        })
    }

    public async getAllGroups(): Promise<IGroupAttributes[]> {
        return await this.groupModel.findAll();
    }
}

export const groupRepositoryService = new GroupRepositoryService(Group);
