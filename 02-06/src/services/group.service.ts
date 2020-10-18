import { groupRepositoryService, GroupRepositoryService } from '../data-access/groupRepositoryService';
import { ICreateGroupBody, IGroupAttributes, IGroupModel, IUpdateGroupBody } from '../types/group.interface';
import { v4 as uuid4 } from 'uuid';
import { pgSequelize } from '../postgres';
import { Sequelize } from 'sequelize';
import { userRepositoryService, UserRepositoryService } from '../data-access/userRepositoryService';

export class GroupService {
    constructor(
        private readonly sequelize: Sequelize,
        private readonly groupRepository: GroupRepositoryService,
        private readonly userRepository: UserRepositoryService
    ) {
    }

    public async addGroup(groupData: ICreateGroupBody): Promise<string> {
        const id = uuid4();
        return await this.groupRepository.insertGroup({id, ...groupData});
    }

    public async getGroupById(id: string): Promise<IGroupModel> {
        return await this.groupRepository.findGroup('id', id).catch(_ => null);
    }

    public async updateGroup(id: string, updateGroupData: IUpdateGroupBody): Promise<void> {
        await this.groupRepository.updateGroup(id, updateGroupData);
    }

    public async deleteGroup(id: string): Promise<void> {
        await this.groupRepository.deleteGroup(id);
    }

    public async getAll(): Promise<IGroupAttributes[]> {
        return await this.groupRepository.getAllGroups();
    }

    public async addUsers(group: IGroupModel, userIds: string[]): Promise<void> {
        const transaction = await this.sequelize.transaction();
        try {
            for (const userId of userIds) {
                await group.addUser(userId, { transaction });
            }
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

}

export const groupService = new GroupService(pgSequelize, groupRepositoryService, userRepositoryService);
