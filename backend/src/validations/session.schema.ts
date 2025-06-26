import { z } from "zod";

export const sessionValidationSchema = z.object({
  event: z.string().min(1, "Event ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.preprocess((arg) => new Date(arg as string), z.date({
    required_error: "Start time is required",
  })),
  endTime: z.preprocess((arg) => new Date(arg as string), z.date({
    required_error: "End time is required",
  })),
  venueRoom: z.string().optional(),
});