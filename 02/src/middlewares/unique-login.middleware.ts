import { NextFunction, Request, Response } from 'express';
import { ICreateUserBody } from '../models/user.model';
import { getAllUsers } from '../utils/user.utils';

export function uniqueLogin(req: Request, res: Response, next: NextFunction) {
    const { login } = req.body as ICreateUserBody;
    const userList = getAllUsers();

    const loginExists = Object.keys(userList).some(id => userList[id].login === login);
    if (loginExists) {
        return res.status(400).json({ error: `User with login ${ login } already exists` });
    }

    next();
}
