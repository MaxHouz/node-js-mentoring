import { NextFunction, Request, Response } from 'express';
import { getUser } from '../utils/user.utils';

export function checkUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = getUser(id);

    if (!user) {
        return res.status(400).send(`User ${id} does not exist`);
    } else if(user.isDeleted && !req.url.toLowerCase().includes('restore')) {
        return res.status(400).send(`User ${id} is softly deleted. Use '/user/restore/:id' to restore and interact with user`);
    }

    req.user = user;
    next();
}
