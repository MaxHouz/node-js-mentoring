import { IUserFull } from './src/models/user.model';

declare global {
    namespace Express {
        interface Request {
            user?: IUserFull;
        }
    }
}
