import { StockQuant } from "../models/stockQuant.model.js";

export const updateStock = async (productId, locationId, qtyChange) => {

    let quant = await StockQuant.findOne({
        product: productId,
        location: locationId
    });

    if (!quant) {
        quant = await StockQuant.create({
            product: productId,
            location: locationId,
            quantity: 0
        });
    }

    quant.quantity += qtyChange;

    if (quant.quantity < 0) {
        throw new Error("Insufficient stock");
    }

    await quant.save();

    return quant;
};