import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../services/error-handling.utils';
import { logger } from '../services/logger.utils';

export async function handleError(err: HttpError, req: Request, res: Response, next: NextFunction) {
    const { message, statusCode } = err;
    logger.error(message);
    return res.status(statusCode || 500).json({
        error: message
    });
}
