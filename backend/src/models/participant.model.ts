import mongoose, { Schema, Document, Model } from "mongoose";
import { z } from "zod";

export const participantValidationSchema = z
  .object({
    event: z.string().min(1, "Event ID is required"),
    user: z.string().optional(),
    type: z.enum(["vendor", "volunteer"], {
      required_error: "Type is required",
    }),
    name: z.string().min(1, "Name is required"),
    contactInfo: z.string().min(1, "Contact Info is required"),
    // Vendor-specific

    category: z.string().optional(),
    approved: z.boolean().optional(),

    // Volunteer-specific
    role: z.string().optional(),
    assigned: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "volunteer") {
        return data.role && data.role.trim().length > 0;
      }
      return true;
    },
    {
      message: "Volunteer role is required",
      path: ["role"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "vendor") {
        return data.category && data.category.trim().length > 0;
      }
      return true;
    },
    { message: "Vendor category is required", path: ["category"] }
  );

export interface IParticipant extends Document {
  event: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  type: "vendor" | "volunteer";
  name: string;
  contactInfo: string;

  // Vendor-only
  category?: string;
  approved?: boolean;

  // Volunteer-only
  role?: string;
  assigned?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const participantSchema: Schema<IParticipant> = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    type: {
      type: String,
      enum: ["vendor", "volunteer"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    // Vendor-specific fields
    category: {
      type: String,
      required: function () {
        return this.type === "vendor";
      },
    },
    approved: {
      type: Boolean,
      default: false,
    },

    // Volunteer-specific fields
    role: {
      type: String,
      required: function () {
        return this.type === "volunteer";
      },
    },
    assigned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Participant: Model<IParticipant> =
  mongoose.models.Participant ||
  mongoose.model<IParticipant>("Participant", participantSchema);

export default Participant;
