import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { ApiError } from "../utils/api-error";

export const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return next(
        new ApiError(
          400,
          error.details.map((detail) => detail.message).join(", ")
        )
      );
    }

    req.body = value;
    next();
  };