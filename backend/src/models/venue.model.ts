import mongoose, { Document, Schema, Model } from "mongoose";

export interface IVenue extends Document {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}

const venueSchema: Schema<IVenue> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

venueSchema.index({ location: "2dsphere" });

const Venue: Model<IVenue> =
  mongoose.models.Venue || mongoose.model<IVenue>("Venue", venueSchema);
export default Venue;
