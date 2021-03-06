import { NextFunction, Request, Response } from 'express';
import { logger } from '../services/logger.utils';

export async function requestLogger(req: Request, res: Response, next: NextFunction) {
    const { method, url, params, body } = req;
    logger.info(`${method} ${url} params: ${JSON.stringify(params)} body: ${JSON.stringify(body)}`);
    next();
}

export async function unhandledErrorsLogger(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(err.stack);
    res.status(500).send('Internal Server Error');
}
