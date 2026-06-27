export type UserRole = "user" | "admin";

export interface UserProfile {
  id?: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}