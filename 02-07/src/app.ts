import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { requestLogger } from './middlewares/request-logger.middleware';
import { userController } from './controllers/user.controller';
import { groupController } from './controllers/group.controller';
import { handleError } from './middlewares/handle-error.middleware';
export const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.use('/user', userController);
app.use('/group', groupController);

app.use(handleError);
