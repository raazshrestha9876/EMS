import { z } from "zod";

export const userRegisterValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  profilePic: z.string().url().optional(),
  role: z.enum(["attendee", "admin", "organizer"]).optional(),
});

export const userLoginValidationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const profileUpdateValidationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .union([
      z.string().min(6, "Password must be at least 6 characters"),
      z.literal(""),
    ])
    .optional(),
  phone: z.string().optional(),
  profilePic: z.string().url().optional(),
});
