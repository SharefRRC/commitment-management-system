import { NextFunction, Request, Response } from "express";
import { auth } from "../config/firebase";
import { ApiError } from "../utils/api-error";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return next(new ApiError(401, "Missing or invalid authorization token"));
    }

    const token = header.split(" ")[1];
    const decoded = await auth.verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: typeof decoded.role === "string" ? decoded.role : "user"
    };

    next();
  } catch {
    next(new ApiError(401, "Unauthorized"));
  }
};

export const authorize =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!roles.includes(req.user.role || "user")) {
      return next(new ApiError(403, "Forbidden"));
    }

    next();
  };