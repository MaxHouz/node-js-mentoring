import express from 'express';
import { userController } from './controllers/user.controller';
import { groupController } from './controllers/group.controller';
import { logger } from './services/logger.service';
import { requestLogger, unhandledErrorsLogger } from './middlewares/request-logger.middleware';

const app = express();
const PORT = 3800;

process
    .on('unhandledRejection', reason => {
        logger.error(`Unhandled Promise Rejection: ${reason}`);
    })
    .on('uncaughtException', err => {
        logger.error(`Uncaught Exception ${err.message}`);
    });

app.use(express.json());
app.use(requestLogger);
app.use(unhandledErrorsLogger);

app.use('/user', userController);
app.use('/group', groupController);

app.listen(PORT, _ => {
    logger.info(`Server listening on port ${PORT}`);
});
