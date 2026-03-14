import express from "express";
import { validateMove } from "../controllers/stockMove.controller.js";

const router = express.Router();

router.post("/:id/validate", validateMove);

export default router;