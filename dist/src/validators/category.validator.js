"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCategorySchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(50).required(),
    color: joi_1.default.string().max(30).optional()
});
exports.updateCategorySchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(50).optional(),
    color: joi_1.default.string().max(30).optional()
}).min(1);
