import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/async-handler";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { registerUserSchema } from "../validators/auth.validator";

const router = Router();

router.post("/register", validate(registerUserSchema), asyncHandler(AuthController.register));
router.post("/logout", asyncHandler(AuthController.logout));
router.get("/me", authenticate, asyncHandler(AuthController.getMe));
router.patch(
  "/users/:id/promote-admin",
  authenticate,
  authorize("admin"),
  asyncHandler(AuthController.promoteToAdmin)
);

export default router;