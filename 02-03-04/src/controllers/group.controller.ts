import { Router } from 'express';
import { checkGroup } from '../middlewares/check-group.middleware';
import { groupService } from '../services/group.service';
import { createGroupSchema, groupValidator, updateGroupSchema } from '../validators/group.validator';

export const groupController = Router();

groupController.post('/create', groupValidator.body(createGroupSchema), async (req, res) => {
    return res.json(await groupService.addGroup(req.body));
});

groupController.get('/get-all', async (req, res) => {
    const groups = await groupService.getAll();
    return res.json({ groups });
});

groupController.post('/add-users/:id', checkGroup, async (req, res) => {
    const { group } = req;
    const userIds: string[] = req.body.users;

    try {
        await groupService.addUsers(group, userIds)
        return res.sendStatus(200);
    } catch (e) {
        return res.status(400).send(e.message);
    }
});

groupController.route('/:id').all(checkGroup)
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
