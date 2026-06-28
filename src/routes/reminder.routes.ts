import { Router } from "express";
import { ReminderController } from "../controllers/reminder.controller";
import { asyncHandler } from "../utils/async-handler";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createReminderSchema,
  updateReminderSchema
} from "../validators/reminder.validator";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(ReminderController.getAll));
router.get("/:id", asyncHandler(ReminderController.getById));
router.post("/", validate(createReminderSchema), asyncHandler(ReminderController.create));
router.put("/:id", validate(updateReminderSchema), asyncHandler(ReminderController.update));
router.delete("/:id", asyncHandler(ReminderController.delete));

export default router;