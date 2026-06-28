import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { asyncHandler } from "../utils/async-handler";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createCategorySchema,
  updateCategorySchema
} from "../validators/category.validator";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(CategoryController.getAll));
router.get("/:id", asyncHandler(CategoryController.getById));
router.post("/", validate(createCategorySchema), asyncHandler(CategoryController.create));
router.put("/:id", validate(updateCategorySchema), asyncHandler(CategoryController.update));
router.delete("/:id", asyncHandler(CategoryController.delete));

export default router;