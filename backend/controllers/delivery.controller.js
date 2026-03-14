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
    ref: m.reference || `WH/OUT/${String(m._id).slice(-5).toUpperCase()}`,
    customer: m.destLocation?.name || "—",
    sourceLocation: m.sourceLocation?.name || "WH/Stock",
    status: m.status,
    scheduledDate: m.scheduledDate,
    notes: m.notes,
    lines: (m.items || []).map((it) => ({
      productName: it.product?.name || it.product,
      demandQty: it.quantity,
      doneQty: m.status === "done" ? it.quantity : 0,
    })),
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

/**
 * Find-or-create a customer Location from a customer name string.
 */
async function resolveCustomerLocation(name) {
  if (!name) return null;
  let loc = await Location.findOne({ name, type: "customer" });
  if (!loc) loc = await Location.create({ name, type: "customer" });
  return loc._id;
}

/**
 * Resolve the default warehouse source location.
 */
async function resolveWarehouseLocation() {
  let loc = await Location.findOne({ type: "warehouse" });
  if (!loc) loc = await Location.create({ name: "WH/Stock", type: "warehouse" });
  return loc._id;
}

/**
 * Convert frontend line items ({ productName, demandQty }) into
 * StockMove items ({ product: ObjectId, quantity: Number }).
 */
async function resolveLineItems(lines) {
  const items = [];
  for (const line of lines) {
    if (!line.productName) continue;

    let product = await Product.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${line.productName}$`, "i") } },
        { sku: { $regex: new RegExp(`^${line.productName}$`, "i") } },
      ],
    });

    if (!product) {
      product = await Product.create({
        name: line.productName,
        sku: line.productName.toUpperCase().replace(/\s+/g, "-"),
      });
    }

    items.push({
      product: product._id,
      quantity: Number(line.demandQty) || 1,
    });
  }
  return items;
}

// ── Controllers ────────────────────────────────────────────

/* LIST DELIVERIES — optionally filter by ?status= */
export const getDeliveries = async (req, res) => {
  try {
    const filter = { type: "delivery" };
    if (req.query.status) filter.status = req.query.status;

    const deliveries = await StockMove.find(filter)
      .populate("sourceLocation", "name type")
      .populate("destLocation", "name type")
      .populate("items.product", "name sku")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.json(new ApiResponse(200, deliveries.map(serialise)));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/* GET SINGLE DELIVERY */
export const getDelivery = async (req, res) => {
  try {
    const delivery = await StockMove.findOne({
      _id: req.params.id,
      type: "delivery",
    })
      .populate("sourceLocation", "name type")
      .populate("destLocation", "name type")
      .populate("items.product", "name sku")
      .populate("createdBy", "name email");

    if (!delivery) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Delivery not found"));
    }

    return res.json(new ApiResponse(200, serialise(delivery)));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/* CREATE DELIVERY */
export const createDelivery = async (req, res) => {
  try {
    const { customer, lines, notes, reference, scheduledDate, sourceLocation, destLocation, items } = req.body;

    let resolvedSource, resolvedDest, resolvedItems;

    if (lines && customer) {
      // Frontend form format
      resolvedSource = await resolveWarehouseLocation();
      resolvedDest = await resolveCustomerLocation(customer);
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

    const delivery = await StockMove.create({
      type: "delivery",
      sourceLocation: resolvedSource,
      destLocation: resolvedDest,
      items: resolvedItems,
      reference,
      notes,
      scheduledDate: scheduledDate || undefined,
      createdBy: req.user?._id,
    });

    const populated = await StockMove.findById(delivery._id)
      .populate("sourceLocation", "name type")
      .populate("destLocation", "name type")
      .populate("items.product", "name sku");

    return res
      .status(201)
      .json(new ApiResponse(201, serialise(populated), "Delivery created"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/* UPDATE DELIVERY (draft only) */
export const updateDelivery = async (req, res) => {
  try {
    const delivery = await StockMove.findOne({
      _id: req.params.id,
      type: "delivery",
    });

    if (!delivery) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Delivery not found"));
    }

    if (delivery.status !== "draft") {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Only draft deliveries can be edited"));
    }

    const { customer, lines, notes, reference, scheduledDate } = req.body;

    if (customer) {
      delivery.destLocation = await resolveCustomerLocation(customer);
    }
    if (lines) {
      delivery.items = await resolveLineItems(lines);
    }
    if (notes !== undefined) delivery.notes = notes;
    if (reference !== undefined) delivery.reference = reference;
    if (scheduledDate !== undefined) delivery.scheduledDate = scheduledDate;

    await delivery.save();

    const populated = await StockMove.findById(delivery._id)
      .populate("sourceLocation", "name type")
      .populate("destLocation", "name type")
      .populate("items.product", "name sku");

    return res.json(new ApiResponse(200, serialise(populated), "Delivery updated"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/* VALIDATE DELIVERY — confirms delivery and updates stock */
export const validateDelivery = async (req, res) => {
  try {
    const existing = await StockMove.findOne({
      _id: req.params.id,
      type: "delivery",
    });

    if (!existing) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Delivery not found"));
    }

    const move = await validateStockMove(req.params.id);

    const populated = await StockMove.findById(move._id)
      .populate("sourceLocation", "name type")
      .populate("destLocation", "name type")
      .populate("items.product", "name sku");

    return res.json(
      new ApiResponse(200, serialise(populated), "Delivery validated successfully")
    );
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.message));
  }
};
