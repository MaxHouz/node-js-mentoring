import { NextFunction, Request, Response } from 'express';
import { ICreateUserBody } from '../types/user.interface';
import { userService } from '../services/user.service';
import { ErrorMessages, HttpError, insertMessageValues } from '../services/error-handling.utils';

export async function uniqueLogin(req: Request, res: Response, next: NextFunction) {
    const { login } = req.body as ICreateUserBody;
    const { id } = req.params;

    if (login) {
        if (await userService.isLoginUsed(login, id)) {
            throw new HttpError(400, insertMessageValues(ErrorMessages.loginUsed, login));
        }
    }

    next();
}
