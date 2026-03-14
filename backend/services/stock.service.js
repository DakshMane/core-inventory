import { StockQuant } from "../models/stockQuant.model.js";

export async function updateStock(product, location, qty, session) {

    let query = StockQuant.findOne({ product, location });
    if (session) query = query.session(session);

    let quant = await query;

    if (!quant) {
        // Only allow creating a new quant record when adding stock (receipts/adjustments).
        // For outbound moves (negative qty) there is genuinely no stock at this location.
        if (qty < 0) {
            throw new Error(
                `Insufficient stock for product ${product} at location ${location}. Available: 0, Required: ${Math.abs(qty)}`
            );
        }
        quant = new StockQuant({
            product,
            location,
            quantity: 0,
        });
    }

    const newQty = quant.quantity + qty;

    if (newQty < 0) {
        throw new Error(
            `Insufficient stock for product ${product} at location ${location}. Available: ${quant.quantity}, Required: ${Math.abs(qty)}`
        );
    }

    quant.quantity = newQty;

    if (session) {
        await quant.save({ session });
    } else {
        await quant.save();
    }

    return quant;
}