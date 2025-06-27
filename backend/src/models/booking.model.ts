import mongoose, { Document, Schema, Model } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  ticket: mongoose.Types.ObjectId;
  quantity: number;
  paymentStatus: "confirmed" | "cancelled";
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
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
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
