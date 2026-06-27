export type ActivityLogEvent =
  | "commitment_created"
  | "commitment_updated"
  | "commitment_completed"
  | "commitment_deleted"
  | "reminder_created"
  | "reminder_updated"
  | "reminder_deleted"
  | "category_created"
  | "category_updated"
  | "category_deleted";

export interface ActivityLog {
  id?: string;
  userId: string;
  commitmentId?: string | null;
  categoryId?: string | null;
  reminderId?: string | null;
  eventType: ActivityLogEvent;
  message: string;
  createdAt?: string;
}