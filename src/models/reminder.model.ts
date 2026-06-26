export interface Reminder {
  id?: string;
  userId: string;
  commitmentId: string;
  reminderDate: string;
  type: "email" | "system";
  deliveryState: "pending" | "sent" | "failed";
  createdAt?: string;
  updatedAt?: string;
}