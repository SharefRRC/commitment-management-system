import { Category } from "../models/category.model";
import { CategoryRepository } from "../repositories/category.repository";
import { CommitmentRepository } from "../repositories/commitment.repository";
import { ApiError } from "../utils/api-error";
import { ActivityLogService } from "./activity-log.service";

export class CategoryService {
  constructor(
    private repository = new CategoryRepository(),
    private commitmentRepository = new CommitmentRepository(),
    private activityLogService = new ActivityLogService()
  ) {}

  async create(userId: string, data: Category): Promise<Category> {
    const existing = await this.repository.findByName(userId, data.name.trim());

    if (existing) {
      throw new ApiError(409, "Category with this name already exists");
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

  async getAll(userId: string): Promise<Category[]> {
    return this.repository.findAllByUser(userId);
  }

  async getById(userId: string, id: string): Promise<Category> {
    const category = await this.repository.findById(id);

    if (!category || category.userId !== userId) {
      throw new ApiError(404, "Category not found");
    }

    return category;
  }

  async update(userId: string, id: string, data: Partial<Category>): Promise<Category> {
    const existing = await this.repository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new ApiError(404, "Category not found");
    }

    if (data.name && data.name.trim() !== existing.name) {
      const duplicate = await this.repository.findByName(userId, data.name.trim());

      if (duplicate && duplicate.id !== id) {
        throw new ApiError(409, "Category with this name already exists");
      }
    }

    const updated: Category = {
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

  async delete(userId: string, id: string): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new ApiError(404, "Category not found");
    }

    const relatedCommitments = await this.commitmentRepository.findByCategoryId(userId, id);

    if (relatedCommitments.length > 0) {
      throw new ApiError(
        400,
        "Cannot delete category because it is assigned to one or more commitments"
      );
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