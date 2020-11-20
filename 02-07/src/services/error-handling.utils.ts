import { logExecutionError } from './logger.utils';

export class ErrorHandler extends Error {
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
            throw new ErrorHandler(500, e.message);
        }
    }

    return descriptor;
};
