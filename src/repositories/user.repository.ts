import { db } from "../config/firebase";
import { UserProfile } from "../models/user.models";

const collection = db.collection("users");

export class UserRepository {
  async create(data: UserProfile): Promise<UserProfile> {
    const docRef = await collection.add(data);
    return { id: docRef.id, ...data };
  }

  async findByFirebaseUid(firebaseUid: string): Promise<UserProfile | null> {
    const snapshot = await collection.where("firebaseUid", "==", firebaseUid).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...(doc.data() as UserProfile) };
  }

  async findById(id: string): Promise<UserProfile | null> {
    const doc = await collection.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...(doc.data() as UserProfile) };
  }

  async update(id: string, data: Partial<UserProfile>): Promise<void> {
    await collection.doc(id).update(data);
  }
}