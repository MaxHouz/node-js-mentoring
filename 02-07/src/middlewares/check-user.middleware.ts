import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user.service';
import { HttpError, ErrorMessages } from '../services/error-handling.utils';

export async function checkUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
        throw new HttpError(404, ErrorMessages.userNotFound)
    } else if(user.isDeleted && !req.url.toLowerCase().includes('restore')) {
        throw new HttpError(400, ErrorMessages.softlyDeletedUser)
    }

    req.user = user;
    next();
}
