import { groupRepositoryService, GroupRepositoryService } from '../data-access/groupRepositoryService';
import { ICreateGroupBody, IGroupAttributes, IGroupModel, IUpdateGroupBody } from '../types/group.interface';
import { v4 as uuid4 } from 'uuid';
import { pgSequelize } from '../postgres';
import { Sequelize } from 'sequelize';
import { HttpError, logAsyncMethodErrors } from './error-handling.utils';

export class GroupService {
    constructor(
        private readonly sequelize: Sequelize,
        private readonly groupRepository: GroupRepositoryService
    ) {
    }

    @logAsyncMethodErrors('groupService.addGroup')
    public async addGroup(groupData: ICreateGroupBody): Promise<string> {
        const id = uuid4();
        return await this.groupRepository.insertGroup({id, ...groupData});
    }

    @logAsyncMethodErrors('groupService.getGroupById')
    public async getGroupById(id: string): Promise<IGroupModel> {
        return await this.groupRepository.findGroup('id', id).catch(_ => null);
    }

    @logAsyncMethodErrors('groupService.updateGroup')
    public async updateGroup(id: string, updateGroupData: IUpdateGroupBody): Promise<void> {
        await this.groupRepository.updateGroup(id, updateGroupData);
    }

    @logAsyncMethodErrors('groupService.addGroup')
    public async deleteGroup(id: string): Promise<void> {
        await this.groupRepository.deleteGroup(id);
    }

    @logAsyncMethodErrors('groupService.getAll')
    public async getAll(): Promise<IGroupAttributes[]> {
        return await this.groupRepository.getAllGroups();
    }

    @logAsyncMethodErrors('groupService.addUsers')
    public async addUsers(group: IGroupModel, userIds: string[]): Promise<void> {
        const transaction = await this.sequelize.transaction();
        try {
            for (const userId of userIds) {
                await group.addUser(userId, { transaction });
            }
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw new HttpError(400, 'Failed to add users');
        }
    }

}

export const groupService = new GroupService(pgSequelize, groupRepositoryService);
