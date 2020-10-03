import { pgSequelize } from '../postgres';
import { DataTypes, UUIDV4 } from 'sequelize';
import { IGroupModel, GroupPermission } from '../types/group.interface';
import { User } from './user.model';

export const Group = pgSequelize.define<IGroupModel>('groups', {
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    permissions: {
        type: DataTypes.ARRAY(
            DataTypes.ENUM({
                values: [
                    ...Object.values(GroupPermission)
                ]
            })
        ),
        defaultValue: []
    }
}, {
    timestamps: false
});

User.belongsToMany(Group, {
    through: 'user_group',
    foreignKey: 'userId',
    timestamps: false
});

Group.belongsToMany(User, {
    through: 'user_group',
    foreignKey: 'groupId',
    timestamps: false
})
