import { z } from "zod";

export const performerValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "Bio is required"),
  image: z.string().min(1, "Image is required"),
  type: z.string().min(1, "Type is required"),
  event: z.string().min(1, "Event ID is required"),
  phone: z.string().min(1, "Phone is required"),
  session: z.string().optional(),
  price: z.number().min(0, "Price is required"),
});

