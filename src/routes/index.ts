import { Router } from "express";
import authRoutes from "./auth.routes";
import commitmentRoutes from "./commitment.routes";
import categoryRoutes from "./category.routes";
import reminderRoutes from "./reminder.routes";
import activityLogRoutes from "./activity-log.routes";
import analyticsRoutes from "./analytics.routes";
import { ActivityLogController } from "../controllers/activity-log.controller";
import { asyncHandler } from "../utils/async-handler";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/commitments", commitmentRoutes);
router.use("/categories", categoryRoutes);
router.use("/reminders", reminderRoutes);
router.use("/activity-logs", activityLogRoutes);
router.use("/analytics", analyticsRoutes);

router.get(
  "/commitments/:id/activity-logs",
  authenticate,
  asyncHandler(ActivityLogController.getByCommitmentId)
);

export default router;