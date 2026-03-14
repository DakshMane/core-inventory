import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["warehouse", "rack", "vendor", "customer", "virtual_loss"],
      default: "warehouse",
    },
    parentLocation: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      default: null,
    },
  },
  { timestamps: true }
);

export const Location = mongoose.model("Location", locationSchema);
