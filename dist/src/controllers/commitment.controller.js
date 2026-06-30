"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitmentController = void 0;
const commitment_service_1 = require("../services/commitment.service");
const service = new commitment_service_1.CommitmentService();
class CommitmentController {
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
    static async updateStatus(req, res) {
        const data = await service.updateStatus(req.user.uid, req.params.id, req.body.status, req.body.completedAt);
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
exports.CommitmentController = CommitmentController;
