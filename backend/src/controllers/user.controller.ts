import { ZodError } from "zod";
import { errorHandler } from "../utils/errorHandler.js";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../types/authenticatedRequest.js";
import { profileUpdateValidationSchema } from "../validations/user.schema.js";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const existingUser = await User.findById(user?.id);
    if (!existingUser) return next(errorHandler(404, "User not found"));
    res.status(200).json({
      success: true,
      data: existingUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = profileUpdateValidationSchema.parse(req.body);
    const { name, email, password, phone, profilePic } = parsedData;

    const { user } = req as AuthenticatedRequest;

    const existingUser = await User.findById(user?.id);
    if (!existingUser) return next(errorHandler(404, "User not found"));

    let hashedPassword = existingUser.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(user?.id, {
      $set: {
        name,
        email,
        password: hashedPassword,
        phone,
        profilePic,
      },
    });
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      next(errorHandler(400, error));
    }
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as AuthenticatedRequest)?.user;

    const existingUser = await User.findById(user?.id);

    if (!existingUser) return next(errorHandler(404, "User not found"));

    await User.findByIdAndDelete(user?.id);

    res.clearCookie("access_token");

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
