import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  color: Joi.string().optional()
});

export const updateCategorySchema = createCategorySchema;