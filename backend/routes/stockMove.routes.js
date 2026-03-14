import express from "express";
import {
    createStockMove,
    getStockMoves,
    getStockMove,
    updateStockMove,
    validateMove
} from "../controllers/stockMove.controller.js";

const router = express.Router();

router.post("/", createStockMove);

router.get("/", getStockMoves);

router.get("/:id", getStockMove);

router.patch("/:id", updateStockMove);

router.post("/:id/validate", validateMove);

export default router;