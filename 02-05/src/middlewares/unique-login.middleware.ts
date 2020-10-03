import { NextFunction, Request, Response } from 'express';
import { ICreateUserBody } from '../types/user.interface';
import { userService } from '../services/user.service';

export async function uniqueLogin(req: Request, res: Response, next: NextFunction) {
    const { login } = req.body as ICreateUserBody;

    if (await userService.isLoginUsed(login)) {
        return res.status(400).json({ error: `User with login ${ login } already exists` });
    }

    next();
}
