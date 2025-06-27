import mongoose, { Schema, Document, Model } from "mongoose";
import { z } from "zod";

export interface IParticipant extends Document {
  event: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  type: "vendor" | "volunteer";
  name: string;
  phone: string;
  address: string;
  approved?: boolean;

  // Vendor-only
  category?: string;

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
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    // Vendor-specific fields
    category: {
      type: String,
      required: function () {
        return this.type === "vendor";
      },
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
