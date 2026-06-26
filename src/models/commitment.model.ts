export interface Commitment {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: string;
  mustStartByDate: string;
  estimatedHours: number;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}