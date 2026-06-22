import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "API is running" });
});

app.use("/api", routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;