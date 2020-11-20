import { createLogger, format, transports } from 'winston';
import config from 'config';

export const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.simple()
            ),
            silent: !config.get('ENABLE_LOGS')
        })
    ]
});

export function logExecutionError(methodName: string, params: Array<string | number | boolean>, error: Error): void {
    logger.error(`Failed to execute ${methodName}(${params.join(', ')}): ${error.message}`);
}
