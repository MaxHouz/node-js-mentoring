import express from 'express';
import { userRouter } from './routes/user.routes';

const app = express();
const PORT = 3800;

app.use(express.json());

app.use('/user', userRouter);

app.listen(PORT, _ => {
    console.log(`Server listening on port ${PORT}`);
});
