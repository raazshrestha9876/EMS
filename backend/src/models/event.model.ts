import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description?: string;
  category?: string;
  startDate: Date;
  endDate: Date;
  organizer: mongoose.Types.ObjectId;
  venue: mongoose.Types.ObjectId;
  capacity?: number;
  image?: string;
  approved?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema: Schema<IEvent> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    venue: {
      type: Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    capacity: { type: Number },
    image: { type: String },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

eventSchema.index({ "venue.location": "2dsphere" });
eventSchema.virtual("sessions", {
  ref: "Session",
  localField: "_id",
  foreignField: "event",
});

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
export default Event;
