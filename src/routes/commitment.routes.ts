import { Router } from "express";
import { CommitmentController } from "../controllers/commitment.controller";
import { asyncHandler } from "../utils/async-handler";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createCommitmentSchema,
  updateCommitmentSchema,
  updateCommitmentStatusSchema
} from "../validators/commitment.validator";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(CommitmentController.getAll));
router.get("/:id", asyncHandler(CommitmentController.getById));
router.post("/", validate(createCommitmentSchema), asyncHandler(CommitmentController.create));
router.put("/:id", validate(updateCommitmentSchema), asyncHandler(CommitmentController.update));
router.patch(
  "/:id/status",
  validate(updateCommitmentStatusSchema),
  asyncHandler(CommitmentController.updateStatus)
);
router.delete("/:id", asyncHandler(CommitmentController.delete));

export default router;