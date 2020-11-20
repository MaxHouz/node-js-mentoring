import { Router } from 'express';
import { checkUser } from '../middlewares/check-user.middleware';
import { uniqueLogin } from '../middlewares/unique-login.middleware';
import { loginUserSchema, registerUserSchema, updateUserSchema, userValidator } from '../validators/user.validators';
import { userService } from '../services/user.service';
import { createToken, validatePassword } from '../services/auth.utils';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ErrorMessages, HttpError, insertMessageValues } from '../services/error-handling.utils';

export const userController = Router();

userController.post('/register', userValidator.body(registerUserSchema), uniqueLogin, async (req, res) => {
    const id = await userService.addUser(req.body)
    const token = createToken(id);
    return res.json({ id, token });
});

userController.post('/login', userValidator.body(loginUserSchema), async (req, res) => {
    const { login, password } = req.body;
    const user = await userService.getUserByLogin(login);

    if(!user) {
        throw new HttpError(403, insertMessageValues(ErrorMessages.unregisteredUser, login));
    }
    if (!validatePassword(password, user.password)) {
        throw new HttpError(403, ErrorMessages.invalidPassword);
    }

    const token = createToken(user.id);

    return res.json({ id: user.id, token });
});

userController.patch('/restore/:id', authMiddleware, checkUser, async (req, res) => {
    const { id } = req.params;

    await userService.restoreUser(id);
    return res.sendStatus(200);
});

userController.get('/auto-suggest', authMiddleware, async (req, res) => {
    // ?value=use&limit=3
    const substr = req.query?.value?.toString() || '';
    const limit = parseInt(req.query?.limit?.toString() || '3', 10);

    return res.json(await userService.getAutoSuggestUsers(substr, limit));
});

userController.route('/:id').all(authMiddleware, checkUser)
    .get((req, res) => {
        const { id, login, age } = req.user;
        return res.json({ id, login, age });
    })
    .put(userValidator.body(updateUserSchema), uniqueLogin, async (req, res) => {
        await userService.updateUser(req.user.id, req.body);
        return res.sendStatus(200);
    })
    .delete(async (req, res) => {
        const { id } = req.params;
        const softDelete = req.query?.soft === 'true';

        await userService.deleteUser(id, softDelete);
        return res.sendStatus(200);
    });

