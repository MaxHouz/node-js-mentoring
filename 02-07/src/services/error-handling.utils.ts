import { logExecutionError } from './logger.utils';

export class HttpError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly message: string
    ) {
        super();
    }
}

export const logAsyncMethodErrors = (name: string) => (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
): PropertyDescriptor => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        try {
            return await originalMethod.apply(this, args);
        } catch (e) {
            logExecutionError(name, [JSON.stringify(args)], e);
            throw new HttpError(500, e.message);
        }
    }

    return descriptor;
};

export enum ErrorMessages {
    unauthorized = 'Unauthorized',
    invalidToken = 'Invalid token',
    groupNotFound = 'Group not found',
    userNotFound = 'User not found',
    softlyDeletedUser = 'Provided user was softly deleted',
    loginUsed = 'User with login $0 already exists',
    unregisteredUser = '$0 is not registered',
    invalidPassword = 'Invalid password'
}

export function insertMessageValues(message: ErrorMessages, ...args: string[]): string {
    return args.reduce((res: string, value: string, index) => res.replace(`$${index}`, `'${value}'`), message)
}
