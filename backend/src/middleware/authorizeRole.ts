import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/errorHandler.js";
import { AuthenticatedRequest } from "../types/authenticatedRequest.js";

export const authorizeRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return next(
        errorHandler(403, "You don't have permission to access this resource")
      );
    }
    next();
  };
};
