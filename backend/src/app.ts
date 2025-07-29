import express from 'express';
import cors from 'cors';
import estimateRouter from './routes/estimateRoutes';
import { notFound, errorHandler } from './middlewares/errorMiddleware';

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET"]
}));

app.use('/api', estimateRouter);

app.use(notFound);
app.use(errorHandler);

export default app;