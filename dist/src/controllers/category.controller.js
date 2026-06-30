"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("../services/category.service");
const service = new category_service_1.CategoryService();
class CategoryController {
    static async create(req, res) {
        const data = await service.create(req.user.uid, req.body);
        res.status(201).json({
            success: true,
            data
        });
    }
    static async getAll(req, res) {
        const data = await service.getAll(req.user.uid);
        res.status(200).json({
            success: true,
            data
        });
    }
    static async getById(req, res) {
        const data = await service.getById(req.user.uid, req.params.id);
        res.status(200).json({
            success: true,
            data
        });
    }
    static async update(req, res) {
        const data = await service.update(req.user.uid, req.params.id, req.body);
        res.status(200).json({
            success: true,
            data
        });
    }
    static async delete(req, res) {
        await service.delete(req.user.uid, req.params.id);
        res.status(204).send();
    }
}
exports.CategoryController = CategoryController;
