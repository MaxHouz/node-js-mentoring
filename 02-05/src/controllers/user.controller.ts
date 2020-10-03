import { Router } from 'express';
import { checkUser } from '../middlewares/check-user.middleware';
import { uniqueLogin } from '../middlewares/unique-login.middleware';
import { registerUserSchema, updateUserSchema, userValidator } from '../validators/user.validators';
import { userService } from '../services/user.service';

export const userController = Router();

userController.post('/register', userValidator.body(registerUserSchema), uniqueLogin, async (req, res) => {
    return res.json(await userService.addUser(req.body));
});

userController.patch('/restore/:id', checkUser, async (req, res) => {
    const { id } = req.params;
    await userService.restoreUser(id);
    return res.sendStatus(200);
});

userController.get('/auto-suggest', async (req, res) => {
    // ?value=use&limit=3
    const substr = req.query?.value?.toString() || '';
    const limit = req.query?.limit?.toString() || '3';

    return res.json(await userService.getAutoSuggestUsers(substr, parseInt(limit, 10)));
});

userController.route('/:id').all(checkUser)
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

