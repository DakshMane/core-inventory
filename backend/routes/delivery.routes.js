import express from "express";
import {
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  validateDelivery,
} from "../controllers/delivery.controller.js";

const router = express.Router();

router.get("/", getDeliveries);

router.get("/:id", getDelivery);

router.post("/", createDelivery);

router.put("/:id", updateDelivery);

router.post("/:id/validate", validateDelivery);

export default router;
