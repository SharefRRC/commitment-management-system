"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitmentService = void 0;
const commitment_repository_1 = require("../repositories/commitment.repository");
const category_repository_1 = require("../repositories/category.repository");
const reminder_repository_1 = require("../repositories/reminder.repository");
const api_error_1 = require("../utils/api-error");
const activity_log_service_1 = require("./activity-log.service");
class CommitmentService {
    constructor(repository = new commitment_repository_1.CommitmentRepository(), categoryRepository = new category_repository_1.CategoryRepository(), reminderRepository = new reminder_repository_1.ReminderRepository(), activityLogService = new activity_log_service_1.ActivityLogService()) {
        this.repository = repository;
        this.categoryRepository = categoryRepository;
        this.reminderRepository = reminderRepository;
        this.activityLogService = activityLogService;
    }
    validateDates(dueDate, mustStartByDate) {
        if (new Date(mustStartByDate) > new Date(dueDate)) {
            throw new api_error_1.ApiError(400, "mustStartByDate cannot be later than dueDate");
        }
    }
    deriveStatus(commitment) {
        if (commitment.status === "completed") {
            return "completed";
        }
        const now = new Date();
        const due = new Date(commitment.dueDate);
        if (now > due) {
            return "overdue";
        }
        return commitment.status;
    }
    async validateCategoryOwnership(userId, categoryId) {
        if (!categoryId) {
            return;
        }
        const category = await this.categoryRepository.findById(categoryId);
        if (!category || category.userId !== userId) {
            throw new api_error_1.ApiError(400, "Invalid categoryId for this user");
        }
    }
    async create(userId, data) {
        this.validateDates(data.dueDate, data.mustStartByDate);
        await this.validateCategoryOwnership(userId, data.categoryId);
        const now = new Date().toISOString();
        let status = data.status;
        if (status !== "completed" && new Date(data.dueDate) < new Date()) {
            status = "overdue";
        }
        const created = await this.repository.create({
            ...data,
            title: data.title.trim(),
            description: data.description?.trim() || "",
            userId,
            status,
            categoryId: data.categoryId ?? null,
            completedAt: status === "completed" ? now : null,
            createdAt: now,
            updatedAt: now
        });
        await this.activityLogService.create({
            userId,
            commitmentId: created.id ?? null,
            categoryId: created.categoryId ?? null,
            eventType: "commitment_created",
            message: `Commitment "${created.title}" was created`
        });
        return created;
    }
    async getAll(userId) {
        const commitments = await this.repository.findAllByUser(userId);
        return commitments.map((commitment) => ({
            ...commitment,
            status: this.deriveStatus(commitment)
        }));
    }
    async getById(userId, id) {
        const commitment = await this.repository.findById(id);
        if (!commitment || commitment.userId !== userId) {
            throw new api_error_1.ApiError(404, "Commitment not found");
        }
        return {
            ...commitment,
            status: this.deriveStatus(commitment)
        };
    }
    async update(userId, id, data) {
        const existing = await this.repository.findById(id);
        if (!existing || existing.userId !== userId) {
            throw new api_error_1.ApiError(404, "Commitment not found");
        }
        const merged = {
            ...existing,
            ...data,
            title: data.title ? data.title.trim() : existing.title,
            description: data.description !== undefined
                ? data.description.trim()
                : existing.description,
            categoryId: data.categoryId !== undefined ? data.categoryId : existing.categoryId,
            updatedAt: new Date().toISOString()
        };
        this.validateDates(merged.dueDate, merged.mustStartByDate);
        await this.validateCategoryOwnership(userId, merged.categoryId);
        if (merged.status === "completed" && !merged.completedAt) {
            merged.completedAt = new Date().toISOString();
        }
        if (merged.status !== "completed") {
            merged.completedAt = null;
        }
        merged.status = this.deriveStatus(merged);
        await this.repository.update(id, merged);
        await this.activityLogService.create({
            userId,
            commitmentId: id,
            categoryId: merged.categoryId ?? null,
            eventType: "commitment_updated",
            message: `Commitment "${merged.title}" was updated`
        });
        return { ...merged, id };
    }
    async updateStatus(userId, id, status, completedAt) {
        const existing = await this.repository.findById(id);
        if (!existing || existing.userId !== userId) {
            throw new api_error_1.ApiError(404, "Commitment not found");
        }
        const updated = {
            ...existing,
            status,
            completedAt: status === "completed"
                ? completedAt || new Date().toISOString()
                : null,
            updatedAt: new Date().toISOString()
        };
        updated.status = this.deriveStatus(updated);
        await this.repository.update(id, updated);
        await this.activityLogService.create({
            userId,
            commitmentId: id,
            categoryId: updated.categoryId ?? null,
            eventType: updated.status === "completed"
                ? "commitment_completed"
                : "commitment_updated",
            message: updated.status === "completed"
                ? `Commitment "${updated.title}" was completed`
                : `Commitment "${updated.title}" status was updated to ${updated.status}`
        });
        return { ...updated, id };
    }
    async delete(userId, id) {
        const existing = await this.repository.findById(id);
        if (!existing || existing.userId !== userId) {
            throw new api_error_1.ApiError(404, "Commitment not found");
        }
        const reminders = await this.reminderRepository.findByCommitmentId(userId, id);
        if (reminders.length > 0) {
            throw new api_error_1.ApiError(400, "Cannot delete commitment because it has related reminders");
        }
        await this.repository.delete(id);
        await this.activityLogService.create({
            userId,
            commitmentId: id,
            categoryId: existing.categoryId ?? null,
            eventType: "commitment_deleted",
            message: `Commitment "${existing.title}" was deleted`
        });
    }
}
exports.CommitmentService = CommitmentService;
