import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user.service';

export async function checkUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
        return res.status(400).send(`User ${id} does not exist`);
    } else if(user.isDeleted && !req.url.toLowerCase().includes('restore')) {
        return res.status(400).send(`User ${id} is softly deleted. Use '/user/restore/:id' to restore and interact with user`);
    }

    req.user = user;
    next();
}
