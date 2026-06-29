"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderService = void 0;
const reminder_repository_1 = require("../repositories/reminder.repository");
const commitment_repository_1 = require("../repositories/commitment.repository");
const api_error_1 = require("../utils/api-error");
const activity_log_service_1 = require("./activity-log.service");
class ReminderService {
    constructor(repository = new reminder_repository_1.ReminderRepository(), commitmentRepository = new commitment_repository_1.CommitmentRepository(), activityLogService = new activity_log_service_1.ActivityLogService()) {
        this.repository = repository;
        this.commitmentRepository = commitmentRepository;
        this.activityLogService = activityLogService;
    }
    async validateCommitmentOwnership(userId, commitmentId) {
        const commitment = await this.commitmentRepository.findById(commitmentId);
        if (!commitment || commitment.userId !== userId) {
            throw new api_error_1.ApiError(400, "Invalid commitmentId for this user");
        }
    }
    async create(userId, data) {
        await this.validateCommitmentOwnership(userId, data.commitmentId);
        const now = new Date().toISOString();
        const created = await this.repository.create({
            ...data,
            userId,
            createdAt: now,
            updatedAt: now
        });
        await this.activityLogService.create({
            userId,
            reminderId: created.id ?? null,
            commitmentId: created.commitmentId,
            eventType: "reminder_created",
            message: `Reminder for commitment ${created.commitmentId} was created`
        });
        return created;
    }
    async getAll(userId) {
        return this.repository.findAllByUser(userId);
    }
    async getById(userId, id) {
        const reminder = await this.repository.findById(id);
        if (!reminder || reminder.userId !== userId) {
            throw new api_error_1.ApiError(404, "Reminder not found");
        }
        return reminder;
    }
    async update(userId, id, data) {
        const existing = await this.repository.findById(id);
        if (!existing || existing.userId !== userId) {
            throw new api_error_1.ApiError(404, "Reminder not found");
        }
        const commitmentId = data.commitmentId || existing.commitmentId;
        await this.validateCommitmentOwnership(userId, commitmentId);
        const updated = {
            ...existing,
            ...data,
            commitmentId,
            updatedAt: new Date().toISOString()
        };
        await this.repository.update(id, updated);
        await this.activityLogService.create({
            userId,
            reminderId: id,
            commitmentId: updated.commitmentId,
            eventType: "reminder_updated",
            message: `Reminder ${id} was updated`
        });
        return { ...updated, id };
    }
    async delete(userId, id) {
        const existing = await this.repository.findById(id);
        if (!existing || existing.userId !== userId) {
            throw new api_error_1.ApiError(404, "Reminder not found");
        }
        await this.repository.delete(id);
        await this.activityLogService.create({
            userId,
            reminderId: id,
            commitmentId: existing.commitmentId,
            eventType: "reminder_deleted",
            message: `Reminder ${id} was deleted`
        });
    }
}
exports.ReminderService = ReminderService;
