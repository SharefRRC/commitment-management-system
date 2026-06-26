import { CommitmentRepository } from "../repositories/commitment.repository";
import { Commitment } from "../models/commitment.model";
import { ApiError } from "../utils/api-error";

export class CommitmentService {
  constructor(private repository = new CommitmentRepository()) {}

  async create(userId: string, data: Commitment): Promise<Commitment> {
    if (new Date(data.mustStartByDate) > new Date(data.dueDate)) {
      throw new ApiError(400, "mustStartByDate cannot be later than dueDate");
    }

    const now = new Date().toISOString();
    return this.repository.create({
      ...data,
      userId,
      createdAt: now,
      updatedAt: now
    });
  }

  async getAll(userId: string): Promise<Commitment[]> {
    return this.repository.findAllByUser(userId);
  }

  async getById(id: string): Promise<Commitment> {
    const item = await this.repository.findById(id);
    if (!item) throw new ApiError(404, "Commitment not found");
    return item;
  }

  async update(id: string, data: Partial<Commitment>): Promise<Commitment> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new ApiError(404, "Commitment not found");

    const merged = { ...existing, ...data, updatedAt: new Date().toISOString() };

    if (new Date(merged.mustStartByDate) > new Date(merged.dueDate)) {
      throw new ApiError(400, "mustStartByDate cannot be later than dueDate");
    }

    await this.repository.update(id, merged);
    return { ...merged, id };
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new ApiError(404, "Commitment not found");
    await this.repository.delete(id);
  }
}