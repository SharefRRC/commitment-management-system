export type ReminderType = "email" | "system";
export type ReminderDeliveryState = "pending" | "sent" | "failed";

export interface Reminder {
  id?: string;
  userId: string;
  commitmentId: string;
  reminderDate: string;
  type: ReminderType;
  deliveryState: ReminderDeliveryState;
  createdAt?: string;
  updatedAt?: string;
}