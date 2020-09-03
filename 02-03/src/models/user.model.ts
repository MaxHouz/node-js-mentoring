import { DataTypes, UUIDV4 } from 'sequelize';
import { pgSequelize } from '../postgres';
import { IUserModel } from '../types/user.interface';

export const User = pgSequelize.define<IUserModel>('users', {
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        validate: {
            min: 4,
            max: 140
        },
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { timestamps: false });
