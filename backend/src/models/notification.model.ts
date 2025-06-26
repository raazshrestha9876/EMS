import mongoose, { Document, Schema, Model } from "mongoose";
import { z } from "zod";

export const notificationValidationSchema = z.object({
  event: z.string().min(1, "Event ID is required"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  recipents: z.array(z.string()).optional(),
});

export interface INotification extends Document {
  event: mongoose.Types.ObjectId;
  title: string;
  message: string;
  recipents: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema: Schema<INotification> = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    recipents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);
export default Notification;
