import { z } from "zod";

export const venueValidationSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]), //[lng, lat]
  }),
});