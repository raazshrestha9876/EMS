import { z } from "zod";

export const bookingValidationSchema = z.object({
  ticket: z.string().min(1, "Ticket is required"),
  quantity: z.number().min(1, "Quantity is required"),
  paymentStatus: z.string().optional(),
  paymentMethod: z.string().optional(),
});