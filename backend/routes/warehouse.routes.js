import express from "express";
import {
  getWarehouses,
  createWarehouse,
  deleteWarehouse,
  getWarehouseLocations,
  createWarehouseLocation,
} from "../controllers/settings.controller.js";

const router = express.Router();

router.get("/", getWarehouses);
router.post("/", createWarehouse);
router.delete("/:id", deleteWarehouse);
router.get("/:id/locations", getWarehouseLocations);
router.post("/locations", createWarehouseLocation);

export default router;
