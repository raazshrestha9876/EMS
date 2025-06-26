import mongoose, { Document, Schema, Model } from "mongoose";
import { z } from "zod";

export const feedbackValidationSchema = z.object({
  event: z.string().min(1, "Event ID is required"),
  user: z.string().min(1, "User ID is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export interface IFeedback extends Document {
  event: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema: Schema<IFeedback> = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", feedbackSchema);
export default Feedback;
