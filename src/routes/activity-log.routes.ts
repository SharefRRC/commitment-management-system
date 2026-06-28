import { Router } from "express";
import { ActivityLogController } from "../controllers/activity-log.controller";
import { asyncHandler } from "../utils/async-handler";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(ActivityLogController.getAll));
router.get("/:id", asyncHandler(ActivityLogController.getById));

export default router;