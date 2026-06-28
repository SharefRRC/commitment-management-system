import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { asyncHandler } from "../utils/async-handler";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/summary", asyncHandler(AnalyticsController.getSummary));
router.get("/categories", asyncHandler(AnalyticsController.getCategories));
router.get("/delays", asyncHandler(AnalyticsController.getDelays));

export default router;