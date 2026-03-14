import express from "express";
import {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductStock,
    getProductMoves
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", createProduct);

router.get("/", getProducts);

router.get("/:id", getProduct);

router.patch("/:id", updateProduct);

router.delete("/:id", deleteProduct);

router.get("/:id/stock", getProductStock);

router.get("/:id/moves", getProductMoves);

export default router;