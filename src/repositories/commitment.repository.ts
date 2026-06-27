import { db } from "../config/firebase";
import { Commitment } from "../models/commitment.model";

const collection = db.collection("commitments");

export class CommitmentRepository {
  async create(data: Commitment): Promise<Commitment> {
    const docRef = await collection.add(data);
    return { id: docRef.id, ...data };
  }

  async findAllByUser(userId: string): Promise<Commitment[]> {
    const snapshot = await collection.where("userId", "==", userId).get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Commitment)
    }));
  }

  async findById(id: string): Promise<Commitment | null> {
    const doc = await collection.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...(doc.data() as Commitment) };
  }

  async update(id: string, data: Partial<Commitment>): Promise<void> {
    await collection.doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    await collection.doc(id).delete();
  }

  async findByCategoryId(userId: string, categoryId: string): Promise<Commitment[]> {
    const snapshot = await collection
      .where("userId", "==", userId)
      .where("categoryId", "==", categoryId)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Commitment)
    }));
  }
}