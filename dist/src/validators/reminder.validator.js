"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReminderSchema = exports.createReminderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createReminderSchema = joi_1.default.object({
    commitmentId: joi_1.default.string().required(),
    reminderDate: joi_1.default.string().isoDate().required(),
    type: joi_1.default.string().valid("email", "system").required(),
    deliveryState: joi_1.default.string().valid("pending", "sent", "failed").required()
});
exports.updateReminderSchema = joi_1.default.object({
    commitmentId: joi_1.default.string().optional(),
    reminderDate: joi_1.default.string().isoDate().optional(),
    type: joi_1.default.string().valid("email", "system").optional(),
    deliveryState: joi_1.default.string().valid("pending", "sent", "failed").optional()
}).min(1);
