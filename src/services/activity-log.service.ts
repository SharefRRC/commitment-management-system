import { ActivityLog, ActivityLogEvent } from "../models/activity-log.model";
import { ActivityLogRepository } from "../repositories/activity-log.repository";

interface CreateActivityLogInput {
  userId: string;
  eventType: ActivityLogEvent;
  message: string;
  commitmentId?: string | null;
  categoryId?: string | null;
  reminderId?: string | null;
}

export class ActivityLogService {
  constructor(private repository = new ActivityLogRepository()) {}

  async create(input: CreateActivityLogInput): Promise<ActivityLog> {
    const payload: ActivityLog = {
      userId: input.userId,
      eventType: input.eventType,
      message: input.message,
      commitmentId: input.commitmentId ?? null,
      categoryId: input.categoryId ?? null,
      reminderId: input.reminderId ?? null,
      createdAt: new Date().toISOString()
    };

    return this.repository.create(payload);
  }

  async getAll(userId: string): Promise<ActivityLog[]> {
    return this.repository.findAllByUser(userId);
  }

  async getById(userId: string, id: string): Promise<ActivityLog | null> {
    const log = await this.repository.findById(id);

    if (!log || log.userId !== userId) {
      return null;
    }

    return log;
  }

  async getByCommitmentId(userId: string, commitmentId: string): Promise<ActivityLog[]> {
    return this.repository.findByCommitmentId(userId, commitmentId);
  }
}