import { db } from "../config/firebase";
import { Reminder } from "../models/reminder.model";

const collection = db.collection("reminders");

export class ReminderRepository {
  async create(data: Reminder): Promise<Reminder> {
    const docRef = await collection.add(data);
    return { id: docRef.id, ...data };
  }

  async findAllByUser(userId: string): Promise<Reminder[]> {
    const snapshot = await collection.where("userId", "==", userId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Reminder) }));
  }

  async findById(id: string): Promise<Reminder | null> {
    const doc = await collection.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...(doc.data() as Reminder) };
  }

  async findByCommitmentId(userId: string, commitmentId: string): Promise<Reminder[]> {
    const snapshot = await collection
      .where("userId", "==", userId)
      .where("commitmentId", "==", commitmentId)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Reminder) }));
  }

  async update(id: string, data: Partial<Reminder>): Promise<void> {
    await collection.doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    await collection.doc(id).delete();
  }
}