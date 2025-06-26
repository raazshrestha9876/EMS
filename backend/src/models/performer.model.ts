import mongoose, { Schema, Model, Document } from "mongoose";
import { z } from "zod";

export const performerValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "Bio is required"),
  image: z.string().min(1, "Image is required"),
  type: z.string().min(1, "Type is required"),
  event: z.string().min(1, "Event ID is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  session: z.string().optional(),
});

export interface IPerformer extends Document {
  name: string;
  bio: string;
  image: string;
  event: mongoose.Types.ObjectId;
  session?: mongoose.Types.ObjectId;
  type: string;
  email?: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const performerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
    },
    type: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Performer: Model<IPerformer> =
  mongoose.models.Performer ||
  mongoose.model<IPerformer>("Performer", performerSchema);
export default Performer;
