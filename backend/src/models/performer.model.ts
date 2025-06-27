import mongoose, { Schema, Model, Document } from "mongoose";

export interface IPerformer extends Document {
  name: string;
  bio: string;
  image: string;
  price: number;
  event: mongoose.Types.ObjectId;
  session?: mongoose.Types.ObjectId;
  type: string;
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
    price: {
      type: Number,
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
