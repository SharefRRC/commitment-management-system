import Joi from "joi";

export const createReminderSchema = Joi.object({
  commitmentId: Joi.string().required(),
  reminderDate: Joi.string().isoDate().required(),
  type: Joi.string().valid("email", "system").required(),
  deliveryState: Joi.string().valid("pending", "sent", "failed").required()
});

export const updateReminderSchema = createReminderSchema;