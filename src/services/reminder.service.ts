import { ReminderRepository } from "../repositories/reminder.repository";
import { Reminder } from "../models/reminder.model";
import { ApiError } from "../utils/api-error";

export class ReminderService {
  constructor(private repository = new ReminderRepository()) {}

  async create(userId: string, data: Reminder): Promise<Reminder> {
    const now = new Date().toISOString();
    return this.repository.create({ ...data, userId, createdAt: now, updatedAt: now });
  }

  async getAll(userId: string): Promise<Reminder[]> {
    return this.repository.findAllByUser(userId);
  }

  async getById(id: string): Promise<Reminder> {
    const item = await this.repository.findById(id);
    if (!item) throw new ApiError(404, "Reminder not found");
    return item;
  }

  async update(id: string, data: Partial<Reminder>): Promise<Reminder> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new ApiError(404, "Reminder not found");

    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    await this.repository.update(id, updated);
    return { ...updated, id };
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new ApiError(404, "Reminder not found");
    await this.repository.delete(id);
  }
}