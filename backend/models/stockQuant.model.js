import mongoose, { Schema } from "mongoose";

// StockQuant represents the actual physical or recorded quantities
// of a product at a specific location at this current point in time.
// It acts as the Ledger / real-time stock snapshot.
const stockQuantSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// Ensure that a product does not have duplicate quants at the exact same location
stockQuantSchema.index({ product: 1, location: 1 }, { unique: true });

export const StockQuant = mongoose.model("StockQuant", stockQuantSchema);
