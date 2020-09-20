import { IUserAttributes } from './user.interface';

declare global {
    namespace Express {
        interface Request {
            user?: IUserAttributes;
        }
    }
}
