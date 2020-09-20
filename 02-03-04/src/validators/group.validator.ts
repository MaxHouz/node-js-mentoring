import * as Joi from '@hapi/joi'
import { createValidator } from 'express-joi-validation';
import { GroupPermission } from '../types/group.interface';

export const groupValidator = createValidator({
   passError: false,
   statusCode: 400
});

export const createGroupSchema = Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array()
        .items(Joi.string().valid(
            GroupPermission.delete,
            GroupPermission.read,
            GroupPermission.share,
            GroupPermission.write,
            GroupPermission.uploadFiles,
        )).required()
});

export const updateGroupSchema = Joi.object({
    name: Joi.string(),
    permissions: Joi.array()
        .items(Joi.string().valid(
            GroupPermission.delete,
            GroupPermission.read,
            GroupPermission.share,
            GroupPermission.write,
            GroupPermission.uploadFiles,
        ))
});
