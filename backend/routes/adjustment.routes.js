import express from "express";
import { createAdjustment } from "../controllers/adjustment.controller.js";

const router = express.Router();

router.post("/", createAdjustment);

export default router;