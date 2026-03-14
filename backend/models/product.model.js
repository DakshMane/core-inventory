import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    unitOfMeasure: {
      type: String,
      default: "Units", // e.g., kg, liters, boxes, units
    },
    reorderLevel: {
      type: Number,
      default: 0,
      description: "Minimum threshold to alert for low stock",
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
