import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  color: Joi.string().max(30).optional()
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  color: Joi.string().max(30).optional()
});