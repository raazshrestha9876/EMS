import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/errorHandler.js";
import { ZodError } from "zod";
import { generateToken } from "../utils/generateToken.js";
import setAuthCookie from "../utils/cookieHelper.js";
import {
  userLoginValidationSchema,
  userRegisterValidationSchema,
} from "../validations/user.schema.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = userRegisterValidationSchema.parse(req.body);
    const { name, email, password, role } = parsedData;

    const user = await User.findOne({ email });
    if (user) return next(errorHandler(400, "Email already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(errorHandler(400, error));
    }
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = userLoginValidationSchema.parse(req.body);
    const { email, password } = parsedData;


    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(400, "Invalid credentials"));

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return next(errorHandler(400, "Invalid credentials"));

    const token = generateToken(user._id.toString());
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(errorHandler(400, error));
    }
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
