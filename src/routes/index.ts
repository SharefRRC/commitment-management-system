import { Router } from "express";
import commitmentRoutes from "./commitment.routes";
import categoryRoutes from "./category.routes";
import reminderRoutes from "./reminder.routes";

const router = Router();

router.use("/commitments", commitmentRoutes);
router.use("/categories", categoryRoutes);
router.use("/reminders", reminderRoutes);

export default router;