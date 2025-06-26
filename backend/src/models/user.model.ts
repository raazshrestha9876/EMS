import mongoose, { Document, Model, Schema } from "mongoose";
import { z } from "zod";


export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  profilePic?: string;
  role: "attendee" | "admin" | "organizer";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    role: {
      type: String,
      enum: ["attendee", "admin", "organizer"],
      default: "attendee",
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
