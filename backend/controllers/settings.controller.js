import { Location } from "../models/location.model.js";
import { Uom } from "../models/uom.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ── Warehouse endpoints (Location type=warehouse) ──────────

/* GET all warehouses */
export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Location.find({ type: "warehouse" }).sort({ createdAt: -1 });
    const data = warehouses.map((w) => ({
      id: w._id,
      name: w.name,
      address: w.parentLocation || "",
    }));
    return res.json(new ApiResponse(200, data));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};



/* CREATE warehouse */
export const createWarehouse = async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name) {
      return res.status(400).json(new ApiResponse(400, null, "Name is required"));
    }
    const warehouse = await Location.create({ name, type: "warehouse" });
    return res.status(201).json(
      new ApiResponse(201, { id: warehouse._id, name: warehouse.name, address: address || "" }, "Warehouse created")
    );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/* DELETE warehouse */
export const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Location.findOneAndDelete({
      _id: req.params.id,
      type: "warehouse",
    });
    if (!warehouse) {
      return res.status(404).json(new ApiResponse(404, null, "Warehouse not found"));
    }
    // Also delete child locations (racks etc.)
    await Location.deleteMany({ parentLocation: req.params.id });
    return res.json(new ApiResponse(200, null, "Warehouse removed"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/* GET locations for a warehouse */
export const getWarehouseLocations = async (req, res) => {
  try {
    const locations = await Location.find({ parentLocation: req.params.id });
    const data = locations.map((l) => ({
      id: l._id,
      name: l.name,
      type: l.type,
    }));
    return res.json(new ApiResponse(200, data));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/* CREATE location under a warehouse */
export const createWarehouseLocation = async (req, res) => {
  try {
    const { warehouseId, name } = req.body;
    if (!name || !warehouseId) {
      return res.status(400).json(new ApiResponse(400, null, "Name and warehouseId are required"));
    }
    const loc = await Location.create({
      name,
      type: "rack",
      parentLocation: warehouseId,
    });
    return res.status(201).json(
      new ApiResponse(201, { id: loc._id, name: loc.name, type: loc.type }, "Location created")
    );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// ── UOM endpoints ──────────────────────────────────────────

/* GET all UOMs */
export const getUoms = async (req, res) => {
  try {
    const uoms = await Uom.find().sort({ name: 1 });
    const data = uoms.map((u) => ({ id: u._id, name: u.name }));
    return res.json(new ApiResponse(200, data));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/* CREATE UOM */
export const createUom = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json(new ApiResponse(400, null, "Name is required"));
    }
    const uom = await Uom.create({ name });
    return res.status(201).json(
      new ApiResponse(201, { id: uom._id, name: uom.name }, "Unit of measure created")
    );
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json(new ApiResponse(400, null, "This unit already exists"));
    }
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};
