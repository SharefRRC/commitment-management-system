import { Commitment } from "../models/commitment.model";
import { CommitmentRepository } from "../repositories/commitment.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { ReminderRepository } from "../repositories/reminder.repository";
import { ApiError } from "../utils/api-error";
import { ActivityLogService } from "./activity-log.service";

export class CommitmentService {
  constructor(
    private repository = new CommitmentRepository(),
    private categoryRepository = new CategoryRepository(),
    private reminderRepository = new ReminderRepository(),
    private activityLogService = new ActivityLogService()
  ) {}

  private validateDates(dueDate: string, mustStartByDate: string): void {
    if (new Date(mustStartByDate) > new Date(dueDate)) {
      throw new ApiError(400, "mustStartByDate cannot be later than dueDate");
    }
  }

  private deriveStatus(commitment: Commitment): Commitment["status"] {
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

  private async validateCategoryOwnership(
    userId: string,
    categoryId?: string | null
  ): Promise<void> {
    if (!categoryId) {
      return;
    }

    const category = await this.categoryRepository.findById(categoryId);

    if (!category || category.userId !== userId) {
      throw new ApiError(400, "Invalid categoryId for this user");
    }
  }

  async create(userId: string, data: Commitment): Promise<Commitment> {
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

  async getAll(userId: string): Promise<Commitment[]> {
    const commitments = await this.repository.findAllByUser(userId);

    return commitments.map((commitment) => ({
      ...commitment,
      status: this.deriveStatus(commitment)
    }));
  }

  async getById(userId: string, id: string): Promise<Commitment> {
    const commitment = await this.repository.findById(id);

    if (!commitment || commitment.userId !== userId) {
      throw new ApiError(404, "Commitment not found");
    }

    return {
      ...commitment,
      status: this.deriveStatus(commitment)
    };
  }

  async update(
    userId: string,
    id: string,
    data: Partial<Commitment>
  ): Promise<Commitment> {
    const existing = await this.repository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new ApiError(404, "Commitment not found");
    }

    const merged: Commitment = {
      ...existing,
      ...data,
      title: data.title ? data.title.trim() : existing.title,
      description:
        data.description !== undefined
          ? data.description.trim()
          : existing.description,
      categoryId:
        data.categoryId !== undefined ? data.categoryId : existing.categoryId,
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

  async updateStatus(
    userId: string,
    id: string,
    status: Commitment["status"],
    completedAt?: string | null
  ): Promise<Commitment> {
    const existing = await this.repository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new ApiError(404, "Commitment not found");
    }

    const updated: Commitment = {
      ...existing,
      status,
      completedAt:
        status === "completed"
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
      eventType:
        updated.status === "completed"
          ? "commitment_completed"
          : "commitment_updated",
      message:
        updated.status === "completed"
          ? `Commitment "${updated.title}" was completed`
          : `Commitment "${updated.title}" status was updated to ${updated.status}`
    });

    return { ...updated, id };
  }

  async delete(userId: string, id: string): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new ApiError(404, "Commitment not found");
    }

    const reminders = await this.reminderRepository.findByCommitmentId(userId, id);

    if (reminders.length > 0) {
      throw new ApiError(
        400,
        "Cannot delete commitment because it has related reminders"
      );
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