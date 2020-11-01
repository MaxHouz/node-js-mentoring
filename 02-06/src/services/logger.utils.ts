import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        })
    ]
});

export function logExecutionError(methodName: string, params: Array<string | number | boolean>, error: Error): void {
    logger.error(`Failed to execute ${methodName}(${params.join(', ')}): ${error.message}`);
}
