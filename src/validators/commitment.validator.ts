import Joi from "joi";

export const createCommitmentSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("").optional(),
  dueDate: Joi.string().isoDate().required(),
  mustStartByDate: Joi.string().isoDate().required(),
  estimatedHours: Joi.number().min(1).required(),
  priority: Joi.string().valid("low", "medium", "high").required(),
  status: Joi.string()
    .valid("pending", "in_progress", "completed", "overdue")
    .required(),
  categoryId: Joi.string().allow(null, "").optional()
});

export const updateCommitmentSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().allow("").optional(),
  dueDate: Joi.string().isoDate().optional(),
  mustStartByDate: Joi.string().isoDate().optional(),
  estimatedHours: Joi.number().min(1).optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  status: Joi.string()
    .valid("pending", "in_progress", "completed", "overdue")
    .optional(),
  categoryId: Joi.string().allow(null, "").optional(),
  completedAt: Joi.string().isoDate().allow(null).optional()
});

export const updateCommitmentStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "in_progress", "completed", "overdue")
    .required(),
  completedAt: Joi.string().isoDate().allow(null).optional()
});