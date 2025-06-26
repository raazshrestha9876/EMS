import mongoose, { Document, Schema, Model } from "mongoose";
import { z } from "zod";

export const bookingValidationSchema = z.object({
  user: z.string().min(1, "User is required"),
  ticket: z.string().min(1, "Ticket is required"),
  quantity: z.number().min(1, "Quantity is required"),
  notes: z.string().optional(),
});

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  ticket: mongoose.Types.ObjectId;
  quantity: number;
  paymentStatus: "confirmed" | "pending" | "cancelled";
  notes?: string;
  paymentMethod: "cash" | "khalti";
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema<IBooking> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["confirmed", "pending", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "khalti"],
      default: "cash",
    },
  },
  { timestamps: true }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
