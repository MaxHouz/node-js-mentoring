import { NextFunction, Request, Response } from 'express';
import { groupService } from '../services/group.service';

export async function checkGroup(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const group = await groupService.getGroupById(id);

    if (!group) {
        return res.status(400).send(`Group ${id} does not exist`)
    }

    req.group = group;
    next();
}
