import { NextFunction, Request, Response } from 'express';
import { groupService } from '../services/group.service';
import { HttpError, ErrorMessages } from '../services/error-handling.utils';

export async function checkGroup(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const group = await groupService.getGroupById(id);

    if (!group) {
        throw new HttpError(400, ErrorMessages.groupNotFound)
    }

    req.group = group;
    next();
}
