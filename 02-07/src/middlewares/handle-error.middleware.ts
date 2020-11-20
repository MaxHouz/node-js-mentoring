import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../services/error-handling.utils';

export async function handleError(err: ErrorHandler, req: Request, res: Response, next: NextFunction) {
    const { message, statusCode } = err;
    res.status(statusCode || 500).json({
        error: message
    });
}
