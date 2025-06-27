import { z } from "zod";

export const feedbackValidationSchema = z.object({
  event: z.string().min(1, "Event ID is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});