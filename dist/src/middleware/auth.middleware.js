"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const firebase_1 = require("../config/firebase");
const api_error_1 = require("../utils/api-error");
const authenticate = async (req, _res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return next(new api_error_1.ApiError(401, "Missing or invalid authorization token"));
        }
        const token = header.split(" ")[1];
        const decoded = await firebase_1.auth.verifyIdToken(token);
        req.user = {
            uid: decoded.uid,
            email: decoded.email,
            role: typeof decoded.role === "string" ? decoded.role : "user"
        };
        next();
    }
    catch {
        next(new api_error_1.ApiError(401, "Unauthorized"));
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => (req, _res, next) => {
    if (!req.user) {
        return next(new api_error_1.ApiError(401, "Unauthorized"));
    }
    const userRole = req.user.role || "user";
    if (!allowedRoles.includes(userRole)) {
        return next(new api_error_1.ApiError(403, "Forbidden"));
    }
    next();
};
exports.authorize = authorize;
