import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { setupSwagger } from "./config/swagger";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Commitment Management System API is running"
  });
});

// Swagger docs
setupSwagger(app);

// Main API routes
app.use("/api", routes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

setupSwagger(app);
export default app;
