export type CommitmentPriority = "low" | "medium" | "high";
export type CommitmentStatus = "pending" | "in_progress" | "completed" | "overdue";

export interface Commitment {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: string;
  mustStartByDate: string;
  estimatedHours: number;
  priority: CommitmentPriority;
  status: CommitmentStatus;
  categoryId?: string | null;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}