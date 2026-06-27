import Joi from "joi";

export const createCommitmentSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("").optional(),
  dueDate: Joi.string().isoDate().required(),
  mustStartByDate: Joi.string().isoDate().required(),
  estimatedHours: Joi.number().min(1).required(),
  priority: Joi.string().valid("low", "medium", "high").required(),
  status: Joi.string().valid("pending", "in_progress", "completed").required(),
  categoryId: Joi.string().optional()
});

export const updateCommitmentSchema = createCommitmentSchema;