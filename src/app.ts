import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { setupSwagger } from "./config/swagger";
import {
  errorHandler,
  notFoundHandler
} from "./middleware/error.middleware";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Commitment Management System API is running"
  });
});

setupSwagger(app);
app.use("/api", routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;