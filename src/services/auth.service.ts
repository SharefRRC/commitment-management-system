import { auth } from "../config/firebase";
import { ApiError } from "../utils/api-error";
import { UserProfile, UserRole } from "../models/user.models";
import { UserRepository } from "../repositories/user.repository";

interface RegisterUserInput {
  email: string;
  password: string;
  displayName: string;
  role?: UserRole;
}

export class AuthService {
  constructor(private userRepository = new UserRepository()) {}

  async register(input: RegisterUserInput): Promise<UserProfile> {
    const role: UserRole = input.role ?? "user";

    const firebaseUser = await auth.createUser({
      email: input.email,
      password: input.password,
      displayName: input.displayName
    });

    await auth.setCustomUserClaims(firebaseUser.uid, { role });

    const now = new Date().toISOString();

    return this.userRepository.create({
      firebaseUid: firebaseUser.uid,
      email: input.email,
      displayName: input.displayName,
      role,
      createdAt: now,
      updatedAt: now
    });
  }

  async getCurrentUser(firebaseUid: string): Promise<UserProfile> {
    const user = await this.userRepository.findByFirebaseUid(firebaseUid);

    if (!user) {
      throw new ApiError(404, "User profile not found");
    }

    return user;
  }

  async promoteToAdmin(requesterRole: string | undefined, userId: string): Promise<void> {
    if (requesterRole !== "admin") {
      throw new ApiError(403, "Only admins can update roles");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await auth.setCustomUserClaims(user.firebaseUid, { role: "admin" });
    await this.userRepository.update(userId, {
      role: "admin",
      updatedAt: new Date().toISOString()
    });
  }
}