import { db } from "../config/firebase";
import { ActivityLog } from "../models/activity-log.model";

const collection = db.collection("activityLogs");

export class ActivityLogRepository {
  async create(data: ActivityLog): Promise<ActivityLog> {
    const docRef = await collection.add(data);
    return { id: docRef.id, ...data };
  }

  async findAllByUser(userId: string): Promise<ActivityLog[]> {
    const snapshot = await collection.where("userId", "==", userId).get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as ActivityLog)
    }));
  }

  async findById(id: string): Promise<ActivityLog | null> {
    const doc = await collection.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...(doc.data() as ActivityLog) };
  }

  async findByCommitmentId(userId: string, commitmentId: string): Promise<ActivityLog[]> {
    const snapshot = await collection
      .where("userId", "==", userId)
      .where("commitmentId", "==", commitmentId)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as ActivityLog)
    }));
  }
}