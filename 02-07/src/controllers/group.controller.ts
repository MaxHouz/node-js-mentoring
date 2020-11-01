import { Router } from 'express';
import { checkGroup } from '../middlewares/check-group.middleware';
import { groupService } from '../services/group.service';
import { createGroupSchema, groupValidator, updateGroupSchema } from '../validators/group.validator';
import { logExecutionError } from '../services/logger.utils';
import { jwtMiddleware } from '../middlewares/token.middleware';

export const groupController = Router();

groupController.post('/create', jwtMiddleware, groupValidator.body(createGroupSchema), async (req, res) => {
    try {
        return res.json(await groupService.addGroup(req.body));
    } catch (err) {
        logExecutionError('groupService.addGroup', [JSON.stringify(req.body)], err);
        return res.status(500).send(err.message);
    }
});

groupController.get('/get-all', jwtMiddleware, async (req, res) => {
    try {
        const groups = await groupService.getAll();
        return res.json({ groups });
    } catch (err) {
        logExecutionError('groupService.getAll', [], err);
        return res.status(500).send(err.message);
    }
});

groupController.post('/groups/:id/users', jwtMiddleware, checkGroup, async (req, res) => {
    const { group } = req;
    const userIds: string[] = req.body.users;

    try {
        await groupService.addUsers(group, userIds)
        return res.sendStatus(200);
    } catch (err) {
        logExecutionError('groupService.addUsers', [JSON.stringify(group), JSON.stringify(userIds)], err);
        return res.status(500).send(err.message);
    }
});

groupController.route('/:id').all(jwtMiddleware, checkGroup)
    .get((req, res) => {
        return res.json(req.group);
    })
    .put(groupValidator.body(updateGroupSchema), async (req, res) => {
        try {
            await groupService.updateGroup(req.group.id, req.body);
            return res.sendStatus(200);
        } catch (err) {
            logExecutionError('groupService.updateGroup', [req.group.id, req.body], err);
            return res.status(500).send(err.message);
        }
    })
    .delete(async (req, res) => {
        const { id } = req.group;
        try {
            await groupService.deleteGroup(id);
            return res.sendStatus(200);
        } catch (err) {
            logExecutionError('groupService.deleteGroup', [id], err);
            return res.status(500).send(err.message);
        }
    });
