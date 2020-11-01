import { Router } from 'express';
import { checkUser } from '../middlewares/check-user.middleware';
import { uniqueLogin } from '../middlewares/unique-login.middleware';
import { loginUserSchema, registerUserSchema, updateUserSchema, userValidator } from '../validators/user.validators';
import { userService } from '../services/user.service';
import { logExecutionError } from '../services/logger.utils';
import { createToken, validatePassword } from '../services/auth.utils';
import { jwtMiddleware } from '../middlewares/token.middleware';

export const userController = Router();

userController.post('/register', userValidator.body(registerUserSchema), uniqueLogin, async (req, res) => {
    try {
        const id = await userService.addUser(req.body)
        const token = createToken(id);
        return res.json({ id, token });
    } catch (err) {
        logExecutionError('userService.addUser', [JSON.stringify(req.body)], err);
        return res.status(500).send(err.message);
    }
});

userController.post('/login', userValidator.body(loginUserSchema), async (req, res) => {
    const { login, password } = req.body;
    const user = await userService.getUserByLogin(login);

    if(!user) {
        return res.status(400).send(`${login} is not registered`);
    }
    if (!validatePassword(password, user.password)) {
        return res.status(400).send('Invalid password.');
    }

    const token = createToken(user.id);

    return res.json({ id: user.id, token });
});

userController.patch('/restore/:id', jwtMiddleware, checkUser, async (req, res) => {
    const { id } = req.params;
    try {
        await userService.restoreUser(id);
        return res.sendStatus(200);
    } catch (err) {
        logExecutionError('userService.restoreUser', [id], err);
        return res.status(500).send(err.message);
    }
});

userController.get('/auto-suggest', jwtMiddleware, async (req, res) => {
    // ?value=use&limit=3
    const substr = req.query?.value?.toString() || '';
    const limit = parseInt(req.query?.limit?.toString() || '3', 10);

    try {
        return res.json(await userService.getAutoSuggestUsers(substr, limit));
    } catch (err) {
        logExecutionError('userService.getAutoSuggestUsers', [substr, limit], err);
        return res.status(500).send(err.message);
    }
});

userController.route('/:id').all(jwtMiddleware, checkUser)
    .get((req, res) => {
        const { id, login, age } = req.user;
        return res.json({ id, login, age });
    })
    .put(userValidator.body(updateUserSchema), uniqueLogin, async (req, res) => {
        try {
            await userService.updateUser(req.user.id, req.body);
            return res.sendStatus(200);
        } catch (err) {
            logExecutionError('userService.updateUser', [req.user.id, req.body], err);
            return res.status(500).send(err.message);
        }
    })
    .delete(async (req, res) => {
        const { id } = req.params;
        const softDelete = req.query?.soft === 'true';
        try {
            await userService.deleteUser(id, softDelete);
            return res.sendStatus(200);
        } catch (err) {
            logExecutionError('userService.deleteUser', [id, softDelete], err);
            return res.status(500).send(err.message);
        }
    });

