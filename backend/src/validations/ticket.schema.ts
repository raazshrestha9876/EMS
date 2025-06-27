import { z } from "zod";

export const ticketValidationSchema = z.object({
  event: z.string().min(1, "Event Id is required"),
  ticketType: z.enum(["VIP", "General", "Student"], {
    required_error: "Ticket type is required",
  }),
  maxTicket: z.number().int().positive().min(1, "Max ticket is required"),
  price: z.number().min(0, "Ticket Price is required"),
});