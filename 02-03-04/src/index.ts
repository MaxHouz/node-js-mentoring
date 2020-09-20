import express from 'express';
import { userController } from './controllers/user.controller';
import { groupController } from './controllers/group.controller';

const app = express();
const PORT = 3800;

app.use(express.json());

app.use('/user', userController);
app.use('/group', groupController);

app.listen(PORT, _ => {
    console.log(`Server listening on port ${PORT}`);
});
