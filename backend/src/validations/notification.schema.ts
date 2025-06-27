import { z } from "zod";

export const notificationValidationSchema = z.object({
  event: z.string().min(1, "Event ID is required"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  recipents: z.array(z.string()).optional(),
});