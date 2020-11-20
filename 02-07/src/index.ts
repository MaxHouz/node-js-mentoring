import { logger } from './services/logger.utils';
import { app } from './app';
import config from 'config';
import { pgSequelize } from './postgres';

const PORT = config.get('SERVER_PORT');

process
    .on('unhandledRejection', reason => {
        logger.error(`Unhandled Promise Rejection: ${reason}`);
    })
    .on('uncaughtException', err => {
        logger.error(`Uncaught Exception ${err.message}`);
    });

app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});

pgSequelize.authenticate()
    .then(() => console.log('DB connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error));
