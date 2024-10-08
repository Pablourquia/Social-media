import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import { usersRouter } from './routes/userRouter';
import { messageRouter } from './routes/messageRouter';
import { publicationRouter } from './routes/publicationRouter';
import dotenv from 'dotenv';

export const app: Application = express();

dotenv.config();

app.use(express.json());
app.use(usersRouter);
app.use(messageRouter);
app.use(publicationRouter);

const mongoUri = process.env.MONGO_URI_DEV;

mongoose.connect(mongoUri || '', {
}).then(() => {
    console.log('Connected to database');
}).catch((error) => {
    console.log('Database connection error', error);
});

app.get('/', (req: Request, res: Response) => {
    res.send('Esta es la ruta raiz');
});

export const startServer = (port: number) => {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            resolve(server);
        });
        server.on('error', (error) => reject(error));
    });
};

const PORT = 3000;
//startServer(PORT);