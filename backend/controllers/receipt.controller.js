import { StockMove } from "../models/stockMove.model.js";
import { Location } from "../models/location.model.js";
import { Product } from "../models/product.model.js";
import { validateStockMove } from "../services/stockMove.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ── Helpers ────────────────────────────────────────────────

/**
 * Transform a StockMove document into the shape the frontend expects.
 */
function serialise(move) {
  const m = move.toObject ? move.toObject() : move;
  return {
    id: m._id,
    ref: m.reference || `WH/IN/${String(m._id).slice(-5).toUpperCase()}`,
    supplier: m.sourceLocation?.name || "—",
    destLocation: m.destLocation?.name || "WH/Stock",
    status: m.status,
    scheduledDate: m.createdAt,
    notes: m.notes,
    lines: (m.items || []).map((it) => ({
      productName: it.product?.name || it.product,
      expectedQty: it.quantity,
      doneQty: m.status === "done" ? it.quantity : 0,
    })),
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

/**
 * Find-or-create a vendor Location from a supplier name string.
 */
async function resolveVendorLocation(name) {
  if (!name) return null;
  let loc = await Location.findOne({ name, type: "vendor" });
  if (!loc) loc = await Location.create({ name, type: "vendor" });
  return loc._id;
}

/**
 * Resolve the default warehouse destination location.
 */
async function resolveWarehouseLocation() {
  let loc = await Location.findOne({ type: "warehouse" });
  if (!loc) loc = await Location.create({ name: "WH/Stock", type: "warehouse" });
  return loc._id;
}

/**
 * Convert frontend line items ({ productName, expectedQty }) into
 * StockMove items ({ product: ObjectId, quantity: Number }).
 */
async function resolveLineItems(lines) {
  const items = [];
  for (const line of lines) {
    if (!line.productName) continue;

    // Try to find by name or SKU
    let product = await Product.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${line.productName}$`, "i") } },
        { sku: { $regex: new RegExp(`^${line.productName}$`, "i") } },
      ],
    });

    if (!product) {
      // Auto-create so the receipt can still be saved
      product = await Product.create({
        name: line.productName,
        sku: line.productName.toUpperCase().replace(/\s+/g, "-"),
      });
    }

    items.push({
      product: product._id,
      quantity: Number(line.expectedQty) || 1,
    });
  }
  return items;
}

// ── Controllers ────────────────────────────────────────────

/* LIST RECEIPTS — optionally filter by ?status= */
export const getReceipts = async (req, res) => {
  try {
    const filter = { type: "receipt" };
    if (req.query.status) filter.status = req.query.status;

    const receipts = await StockMove.find(filter)
      .populate("sourceLocation", "name type")
      .populate("destLocation", "name type")
      .populate("items.product", "name sku")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.json(new ApiResponse(200, receipts.map(serialise)));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/* GET SINGLE RECEIPT */
export const getReceipt = async (req, res) => {
  try {
    const receipt = await StockMove.findOne({
      _id: req.params.id,
      type: "receipt",
    })
      .populate("sourceLocation", "name type")
      .populate("destLocation", "name type")
      .populate("items.product", "name sku")
      .populate("createdBy", "name email");

    if (!receipt) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Receipt not found"));
    }

    return res.json(new ApiResponse(200, serialise(receipt)));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/* CREATE RECEIPT */
export const createReceipt = async (req, res) => {
  try {
    const { supplier, lines, notes, reference, sourceLocation, destLocation, items } = req.body;

    // Support both frontend-form format and raw StockMove format
    let resolvedSource, resolvedDest, resolvedItems;

    if (lines && supplier) {
      // Frontend form format
      resolvedSource = await resolveVendorLocation(supplier);
      resolvedDest = await resolveWarehouseLocation();
      resolvedItems = await resolveLineItems(lines);
    } else {
      // Raw StockMove format
      resolvedSource = sourceLocation;
      resolvedDest = destLocation;
      resolvedItems = items;
    }

    if (!resolvedItems || resolvedItems.length === 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "At least one line item is required"));
    }

    const receipt = await StockMove.create({
      type: "receipt",
      sourceLocation: resolvedSource,
      destLocation: resolvedDest,
      items: resolvedItems,
      reference,
      notes,
      createdBy: req.user?._id,
    });

    // Re-fetch with populates for the response
    const populated = await StockMove.findById(receipt._id)
      .populate("sourceLocation", "name type")
      .populate("destLocation", "name type")
      .populate("items.product", "name sku");

    return res
      .status(201)
      .json(new ApiResponse(201, serialise(populated), "Receipt created"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/* UPDATE RECEIPT (draft only) */
export const updateReceipt = async (req, res) => {
  try {
    const receipt = await StockMove.findOne({
      _id: req.params.id,
      type: "receipt",
    });

    if (!receipt) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Receipt not found"));
    }

    if (receipt.status !== "draft") {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Only draft receipts can be edited"));
    }

    const { supplier, lines, notes, reference } = req.body;

    if (supplier) {
      receipt.sourceLocation = await resolveVendorLocation(supplier);
    }
    if (lines) {
      receipt.items = await resolveLineItems(lines);
    }
    if (notes !== undefined) receipt.notes = notes;
    if (reference !== undefined) receipt.reference = reference;

    await receipt.save();

    const populated = await StockMove.findById(receipt._id)
      .populate("sourceLocation", "name type")
      .populate("destLocation", "name type")
      .populate("items.product", "name sku");

    return res.json(new ApiResponse(200, serialise(populated), "Receipt updated"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/* VALIDATE RECEIPT — confirms receipt and updates stock */
export const validateReceipt = async (req, res) => {
  try {
    const existing = await StockMove.findOne({
      _id: req.params.id,
      type: "receipt",
    });

    if (!existing) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Receipt not found"));
    }

    const move = await validateStockMove(req.params.id);

    const populated = await StockMove.findById(move._id)
      .populate("sourceLocation", "name type")
      .populate("destLocation", "name type")
      .populate("items.product", "name sku");

    return res.json(
      new ApiResponse(200, serialise(populated), "Receipt validated successfully")
    );
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.message));
  }
};
