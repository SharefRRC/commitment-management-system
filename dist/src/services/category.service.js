"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_repository_1 = require("../repositories/category.repository");
const commitment_repository_1 = require("../repositories/commitment.repository");
const api_error_1 = require("../utils/api-error");
const activity_log_service_1 = require("./activity-log.service");
class CategoryService {
    constructor(repository = new category_repository_1.CategoryRepository(), commitmentRepository = new commitment_repository_1.CommitmentRepository(), activityLogService = new activity_log_service_1.ActivityLogService()) {
        this.repository = repository;
        this.commitmentRepository = commitmentRepository;
        this.activityLogService = activityLogService;
    }
    async create(userId, data) {
        const existing = await this.repository.findByName(userId, data.name.trim());
        if (existing) {
            throw new api_error_1.ApiError(409, "Category with this name already exists");
        }
        const now = new Date().toISOString();
        const created = await this.repository.create({
            ...data,
            name: data.name.trim(),
            userId,
            createdAt: now,
            updatedAt: now
        });
        await this.activityLogService.create({
            userId,
            categoryId: created.id ?? null,
            eventType: "category_created",
            message: `Category "${created.name}" was created`
        });
        return created;
    }
    async getAll(userId) {
        return this.repository.findAllByUser(userId);
    }
    async getById(userId, id) {
        const category = await this.repository.findById(id);
        if (!category || category.userId !== userId) {
            throw new api_error_1.ApiError(404, "Category not found");
        }
        return category;
    }
    async update(userId, id, data) {
        const existing = await this.repository.findById(id);
        if (!existing || existing.userId !== userId) {
            throw new api_error_1.ApiError(404, "Category not found");
        }
        if (data.name && data.name.trim() !== existing.name) {
            const duplicate = await this.repository.findByName(userId, data.name.trim());
            if (duplicate && duplicate.id !== id) {
                throw new api_error_1.ApiError(409, "Category with this name already exists");
            }
        }
        const updated = {
            ...existing,
            ...data,
            name: data.name ? data.name.trim() : existing.name,
            updatedAt: new Date().toISOString()
        };
        await this.repository.update(id, updated);
        await this.activityLogService.create({
            userId,
            categoryId: id,
            eventType: "category_updated",
            message: `Category "${updated.name}" was updated`
        });
        return { ...updated, id };
    }
    async delete(userId, id) {
        const existing = await this.repository.findById(id);
        if (!existing || existing.userId !== userId) {
            throw new api_error_1.ApiError(404, "Category not found");
        }
        const relatedCommitments = await this.commitmentRepository.findByCategoryId(userId, id);
        if (relatedCommitments.length > 0) {
            throw new api_error_1.ApiError(400, "Cannot delete category because it is assigned to one or more commitments");
        }
        await this.repository.delete(id);
        await this.activityLogService.create({
            userId,
            categoryId: id,
            eventType: "category_deleted",
            message: `Category "${existing.name}" was deleted`
        });
    }
}
exports.CategoryService = CategoryService;
