import { CategoryRepository } from "../repositories/category.repository";
import { Category } from "../models/category.model";
import { ApiError } from "../utils/api-error";

export class CategoryService {
  constructor(private repository = new CategoryRepository()) {}

  async create(userId: string, data: Category): Promise<Category> {
    const now = new Date().toISOString();
    return this.repository.create({ ...data, userId, createdAt: now, updatedAt: now });
  }

  async getAll(userId: string): Promise<Category[]> {
    return this.repository.findAllByUser(userId);
  }

  async getById(id: string): Promise<Category> {
    const item = await this.repository.findById(id);
    if (!item) throw new ApiError(404, "Category not found");
    return item;
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new ApiError(404, "Category not found");

    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    await this.repository.update(id, updated);
    return { ...updated, id };
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new ApiError(404, "Category not found");
    await this.repository.delete(id);
  }
}