import { z } from "zod";

export const eventValidationSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  venue: z.string().min(1, "Venue ID is required"),
  startDate: z.preprocess(
    (arg) => new Date(arg as string),
    z.date({ required_error: "Start date is required" })
  ),
  endDate: z.preprocess(
    (arg) => new Date(arg as string),
    z.date({ required_error: "End date is required" })
  ),
  organizer: z.string().min(1, "Organizer ID is required"),
  capacity: z.number().int().nonnegative().optional(),
  image: z.string().url().optional(),
  approved: z.boolean().optional(),
});
