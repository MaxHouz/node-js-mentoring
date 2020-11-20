import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import config from 'config';
import { HttpError, ErrorMessages } from '../services/error-handling.utils';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-auth-token'];

    if (!token) {
        throw new HttpError(401, ErrorMessages.unauthorized);
    }

    verify(token as string, config.get('JWT_KEY'), {},(err, decoded: { id: string }) => {
        if (err) throw new HttpError(403, ErrorMessages.invalidToken);
        req.userId = decoded.id;
        next();
    })
}
