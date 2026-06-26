import { db } from "../config/firebase";
import { Category } from "../models/category.model";

const collection = db.collection("categories");

export class CategoryRepository {
  async create(data: Category): Promise<Category> {
    const docRef = await collection.add(data);
    return { id: docRef.id, ...data };
  }

  async findAllByUser(userId: string): Promise<Category[]> {
    const snapshot = await collection.where("userId", "==", userId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Category) }));
  }

  async findById(id: string): Promise<Category | null> {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...(doc.data() as Category) };
  }

  async update(id: string, data: Partial<Category>): Promise<void> {
    await collection.doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    await collection.doc(id).delete();
  }
}