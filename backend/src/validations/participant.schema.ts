import { z } from "zod";

export const participantValidationSchema = z
  .object({
    event: z.string().min(1, "Event ID is required"),
    user: z.string().optional(),
    type: z.enum(["vendor", "volunteer"], {
      required_error: "Type is required",
    }),
    name: z.string().min(1, "Name is required"),
    phone: z.string().length(10, "Phone number must be 10 digits"),
    address: z.string().min(1, "Address is required"),
    approved: z.boolean().optional(),

    // Vendor-specific
    category: z.string().optional(),

    // Volunteer-specific
    role: z.string().optional(),
    assigned: z.boolean().optional().default(false),
  })
  // Volunteer rules
  .refine(
    (data) => {
      if (data.type === "volunteer") {
        const hasValidRole = data.role && data.role.trim().length > 0;
        const hasAssigned = typeof data.assigned === "boolean";
        const hasCategory = "category" in data;

        return hasValidRole && hasAssigned && !hasCategory;
      }
      return true;
    },
    {
      message: "Volunteer must have role, assigned, and no category",
      path: ["role"],
    }
  )
  // Vendor rules
  .refine(
    (data) => {
      if (data.type === "vendor") {
        const hasValidCategory =
          data.category && data.category.trim().length > 0;
        const hasRole = "role" in data;
        const hasAssigned = "assigned" in data;

        return hasValidCategory && !hasRole && !hasAssigned;
      }
      return true;
    },
    {
      message:
        "Vendor must have category and should not include role or assigned fields.",
      path: ["category"],
    }
  );
