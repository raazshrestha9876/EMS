import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import { AuthenticatedRequest } from "../types/authenticatedRequest.js";
import User from "../models/user.model.js";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "Unauthorized"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("role");
    if (!user) return next(errorHandler(401, "Unauthorized"));
    (req as AuthenticatedRequest).user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (err) {
    next(errorHandler(403, "Forbidden"));
  }
};

export default verifyToken;
