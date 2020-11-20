import { Router } from 'express';
import { checkGroup } from '../middlewares/check-group.middleware';
import { groupService } from '../services/group.service';
import { createGroupSchema, groupValidator, updateGroupSchema } from '../validators/group.validator';
import { jwtMiddleware } from '../middlewares/token.middleware';

export const groupController = Router();

groupController.post('/create', jwtMiddleware, groupValidator.body(createGroupSchema), async (req, res) => {
    return res.json(await groupService.addGroup(req.body));
});

groupController.get('/get-all', jwtMiddleware, async (req, res) => {
    const groups = await groupService.getAll();
    return res.json({ groups });
});

groupController.post('/groups/:id/users', jwtMiddleware, checkGroup, async (req, res) => {
    const { group } = req;
    const userIds: string[] = req.body.users;

    await groupService.addUsers(group, userIds)
    return res.sendStatus(200);
});

groupController.route('/:id').all(jwtMiddleware, checkGroup)
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
