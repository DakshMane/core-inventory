import mongoose, { Schema } from "mongoose";

const uomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Uom = mongoose.model("Uom", uomSchema);
