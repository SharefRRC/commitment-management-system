"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const auth_1 = require("firebase-admin/auth");
const env_1 = require("./env");
const app = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)({
        projectId: env_1.env.firebaseProjectId,
        clientEmail: env_1.env.firebaseClientEmail,
        privateKey: env_1.env.firebasePrivateKey,
    }),
});
exports.db = (0, firestore_1.getFirestore)(app);
exports.auth = (0, auth_1.getAuth)(app);
