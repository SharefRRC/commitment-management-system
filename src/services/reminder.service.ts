import { Reminder } from "../models/reminder.model";
import { ReminderRepository } from "../repositories/reminder.repository";
import { CommitmentRepository } from "../repositories/commitment.repository";
import { ApiError } from "../utils/api-error";
import { ActivityLogService } from "./activity-log.service";

export class ReminderService {
  constructor(
    private repository = new ReminderRepository(),
    private commitmentRepository = new CommitmentRepository(),
    private activityLogService = new ActivityLogService()
  ) {}

  private async validateCommitmentOwnership(
    userId: string,
    commitmentId: string
  ): Promise<void> {
    const commitment = await this.commitmentRepository.findById(commitmentId);

    if (!commitment || commitment.userId !== userId) {
      throw new ApiError(400, "Invalid commitmentId for this user");
    }
  }

  async create(userId: string, data: Reminder): Promise<Reminder> {
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

  async getAll(userId: string): Promise<Reminder[]> {
    return this.repository.findAllByUser(userId);
  }

  async getById(userId: string, id: string): Promise<Reminder> {
    const reminder = await this.repository.findById(id);

    if (!reminder || reminder.userId !== userId) {
      throw new ApiError(404, "Reminder not found");
    }

    return reminder;
  }

  async update(userId: string, id: string, data: Partial<Reminder>): Promise<Reminder> {
    const existing = await this.repository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new ApiError(404, "Reminder not found");
    }

    const commitmentId = data.commitmentId || existing.commitmentId;
    await this.validateCommitmentOwnership(userId, commitmentId);

    const updated: Reminder = {
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

  async delete(userId: string, id: string): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new ApiError(404, "Reminder not found");
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