"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const api_error_1 = require("../utils/api-error");
const notFoundHandler = (_req, _res, next) => {
    next(new api_error_1.ApiError(404, "Route not found"));
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err instanceof api_error_1.ApiError ? err.statusCode : 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || "Internal server error"
    });
};
exports.errorHandler = errorHandler;
