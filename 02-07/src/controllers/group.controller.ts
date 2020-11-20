import { Router } from 'express';
import { checkGroup } from '../middlewares/check-group.middleware';
import { groupService } from '../services/group.service';
import { createGroupSchema, groupValidator, updateGroupSchema } from '../validators/group.validator';
import { authMiddleware } from '../middlewares/auth.middleware';

export const groupController = Router();

groupController.post('/create', authMiddleware, groupValidator.body(createGroupSchema), async (req, res) => {
    return res.json({ id: await groupService.addGroup(req.body) });
});

groupController.get('/get-all', authMiddleware, async (req, res) => {
    const groups = await groupService.getAll();
    return res.json({ groups });
});

groupController.post('/groups/:id/users', authMiddleware, checkGroup, async (req, res) => {
    const { group } = req;
    const userIds: string[] = req.body.users;

    await groupService.addUsers(group, userIds)
    return res.sendStatus(200);
});

groupController.route('/:id').all(authMiddleware, checkGroup)
    .get((req, res) => {
        return res.json(req.group);
    })
    .put(groupValidator.body(updateGroupSchema), async (req, res) => {
        await groupService.updateGroup(req.group.id, req.body);
        return res.sendStatus(200);
    })
    .delete(async (req, res) => {
        const { id } = req.group;
        await groupService.deleteGroup(id);
        return res.sendStatus(200);
    });
