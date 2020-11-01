import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import config from 'config';

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-auth-token'];

    if (!token) {
        return res.status(401).send('Unauthorized Error');
    }

    verify(token as string, config.get('JWT_KEY'), {},(err, decoded) => {
        if (err) return res.status(403).send('Forbidden Error');
        next();
    })
}
