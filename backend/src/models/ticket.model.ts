import mongoose, { Document, Schema, Model } from "mongoose";
import { z } from "zod";

export const ticketValidationSchema = z.object({
  event: z.string().min(1, "Event Id is required"),
  ticketType: z.enum(["VIP", "General", "Student"], {
    required_error: "Ticket type is required",
  }),
  maxTicket: z.number().int().positive().min(1, "Max ticket is required"),
  price: z.number().min(0, "Ticket Price is required"),
});

export interface ITicket extends Document {
  event: mongoose.Types.ObjectId;
  ticketType: "VIP" | "General" | "Student";
  price: number;
  maxTicket: number;
  ticketStatus: "Available" | "Sold" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema: Schema<ITicket> = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketType: {
      type: String,
      enum: ["VIP", "General", "Student"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxTicket: {
      type: Number,
      required: true,
    },
    ticketStatus: {
      type: String,
      enum: ["Available", "Sold", "Cancelled"],
      default: "Available",
    },
  },
  { timestamps: true }
);

const Ticket: Model<ITicket> =
  mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", ticketSchema);
export default Ticket;
