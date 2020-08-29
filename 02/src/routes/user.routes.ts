import { Router } from 'express';
import { checkUser } from '../middlewares/check-user.middleware';
import { uniqueLogin } from '../middlewares/unique-login.middleware';
import {
    addUser,
    updateUser,
    deleteUser,
    restoreUser,
    softDeleteUser,
    getAutoSuggestUsers
} from '../utils/user.utils';
import { registerUserSchema, updateUserSchema, userValidator } from '../validators/user.validators';

export const userRouter = Router();

userRouter.post('/register', userValidator.body(registerUserSchema), uniqueLogin, (req, res) => {
    return res.json(addUser(req.body));
});

userRouter.patch('/restore/:id', checkUser, (req, res) => {
    restoreUser(req.user);
    return res.sendStatus(200);
});

userRouter.get('/auto-suggest', (req, res) => {
    // ?value=use&limit=3
    const substr = req.query?.value?.toString() || '';
    const limit = req.query?.limit?.toString() || '3';

    return res.json(getAutoSuggestUsers(substr, parseInt(limit)));
});

userRouter.route('/:id').all(checkUser)
    .get((req, res) => {
        const { id, login, age } = req.user;
        return res.json({ id, login, age });
    })
    .put(userValidator.body(updateUserSchema), uniqueLogin,(req, res) => {
        updateUser(req.user, req.body);
        return res.sendStatus(200);
    })
    .delete((req, res) => {
        if (req.query?.soft === 'true') {
            softDeleteUser(req.user);
        } else {
            deleteUser(req.params.id);
        }
        return res.sendStatus(200);
    });
