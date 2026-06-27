import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { env } from "./env";

const app = initializeApp({
  credential: cert({
    projectId: env.firebaseProjectId,
    clientEmail: env.firebaseClientEmail,
    privateKey: env.firebasePrivateKey,
  }),
});

export const db = getFirestore(app);
export const auth = getAuth(app);