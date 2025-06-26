import mongoose, { Document, Model, Schema } from "mongoose";
import { z } from "zod";

export interface ISession extends Document {
  event: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  venueRoom?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
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
    description: {
      type: String,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    venueRoom: {
      type: String,
    },
  },
  { timestamps: true }
);



const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);
export default Session;
