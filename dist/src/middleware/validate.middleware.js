"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const api_error_1 = require("../utils/api-error");
const validate = (schema) => (req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });
    if (error) {
        return next(new api_error_1.ApiError(400, error.details.map((detail) => detail.message).join(", ")));
    }
    req.body = value;
    next();
};
exports.validate = validate;
