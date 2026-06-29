"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderRepository = void 0;
const firebase_1 = require("../config/firebase");
const collection = firebase_1.db.collection("reminders");
class ReminderRepository {
    async create(data) {
        const docRef = await collection.add(data);
        return { id: docRef.id, ...data };
    }
    async findAllByUser(userId) {
        const snapshot = await collection.where("userId", "==", userId).get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    async findById(id) {
        const doc = await collection.doc(id).get();
        if (!doc.exists) {
            return null;
        }
        return { id: doc.id, ...doc.data() };
    }
    async findByCommitmentId(userId, commitmentId) {
        const snapshot = await collection
            .where("userId", "==", userId)
            .where("commitmentId", "==", commitmentId)
            .get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    async update(id, data) {
        await collection.doc(id).update(data);
    }
    async delete(id) {
        await collection.doc(id).delete();
    }
}
exports.ReminderRepository = ReminderRepository;
