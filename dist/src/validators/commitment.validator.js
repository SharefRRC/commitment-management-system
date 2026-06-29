"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommitmentStatusSchema = exports.updateCommitmentSchema = exports.createCommitmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCommitmentSchema = joi_1.default.object({
    title: joi_1.default.string().min(3).max(100).required(),
    description: joi_1.default.string().max(1000).allow("").optional(),
    dueDate: joi_1.default.string().isoDate().required(),
    mustStartByDate: joi_1.default.string().isoDate().required(),
    estimatedHours: joi_1.default.number().min(1).required(),
    priority: joi_1.default.string().valid("low", "medium", "high").required(),
    status: joi_1.default.string()
        .valid("pending", "in_progress", "completed", "overdue")
        .required(),
    categoryId: joi_1.default.string().allow(null, "").optional()
});
exports.updateCommitmentSchema = joi_1.default.object({
    title: joi_1.default.string().min(3).max(100).optional(),
    description: joi_1.default.string().max(1000).allow("").optional(),
    dueDate: joi_1.default.string().isoDate().optional(),
    mustStartByDate: joi_1.default.string().isoDate().optional(),
    estimatedHours: joi_1.default.number().min(1).optional(),
    priority: joi_1.default.string().valid("low", "medium", "high").optional(),
    status: joi_1.default.string()
        .valid("pending", "in_progress", "completed", "overdue")
        .optional(),
    categoryId: joi_1.default.string().allow(null, "").optional()
}).min(1);
exports.updateCommitmentStatusSchema = joi_1.default.object({
    status: joi_1.default.string()
        .valid("pending", "in_progress", "completed", "overdue")
        .required(),
    completedAt: joi_1.default.string().isoDate().allow(null).optional()
});
