import mongoose, { Schema } from "mongoose";

const stockMoveSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["receipt", "delivery", "transfer", "adjustment"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "waiting", "ready", "done", "cancelled"],
      default: "draft",
    },
    reference: {
      type: String,
      trim: true,
      description: "External reference like Vendor Bill or Order #",
    },
    sourceLocation: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    destLocation: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const StockMove = mongoose.model("StockMove", stockMoveSchema);
