
import { StockMove } from "../models/stockMove.model.js";
import { StockQuant } from "../models/stockQuant.model.js";
import { Product } from "../models/product.model.js";
import { updateStock } from "./stock.service.js";

export const validateStockMove = async (moveId) => {

    const move = await StockMove.findById(moveId);

    if (!move) {
        throw new Error("Stock move not found");
    }

    if (move.status === "done") {
        throw new Error("Already validated");
    }

    // ── Pre-flight availability check for outbound moves ──────────────────
    // Check ALL items before touching any stock so we never leave stock in a
    // partially-deducted state and we can report which product is the problem.
    const outboundTypes = ["delivery", "transfer"];
    if (outboundTypes.includes(move.type)) {
        for (const item of move.items) {
            const { product, quantity } = item;
            const quant = await StockQuant.findOne({
                product,
                location: move.sourceLocation,
            });
            const available = quant ? quant.quantity : 0;

            if (available < quantity) {
                // Try to get a human-readable product name for the error
                const prod = await Product.findById(product).select("name sku").lean();
                const label = prod ? (prod.name || prod.sku) : String(product);
                throw new Error(
                    `Insufficient stock for "${label}": available ${available}, required ${quantity}`
                );
            }
        }
    }
    // ─────────────────────────────────────────────────────────────────────

    for (const item of move.items) {

        const { product, quantity } = item;

        if (move.type === "receipt") {

            await updateStock(product, move.destLocation, quantity);

        }

        if (move.type === "delivery") {

            await updateStock(product, move.sourceLocation, -quantity);

        }

        if (move.type === "transfer") {

            await updateStock(product, move.sourceLocation, -quantity);

            await updateStock(product, move.destLocation, quantity);

        }

        if (move.type === "adjustment") {

            await updateStock(product, move.destLocation, quantity);

        }

    }

    move.status = "done";

    await move.save();

    return move;
};
