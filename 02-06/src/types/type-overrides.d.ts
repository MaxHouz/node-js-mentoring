import { IUserModel } from './user.interface';
import { IGroupModel } from './group.interface';

declare global {
    namespace Express {
        interface Request {
            user?: IUserModel;
            group?: IGroupModel;
        }
    }
}
