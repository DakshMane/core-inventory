import { StockQuant } from "../models/stockQuant.model.js";
import { StockMove } from "../models/stockMove.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* CREATE INVENTORY ADJUSTMENT */

export const createAdjustment = async (req, res) => {

    try {

        const { product, location, countedQuantity, notes } = req.body;

        if (!product || !location) {
            return res.status(400).json(
                new ApiResponse(400, null, "Product and location required")
            );
        }

        const quant = await StockQuant.findOne({
            product,
            location
        });

        const systemQuantity = quant ? quant.quantity : 0;

        const difference = countedQuantity - systemQuantity;

        if (difference === 0) {
            return res.json(
                new ApiResponse(
                    200,
                    null,
                    "No adjustment needed"
                )
            );
        }

        const adjustmentMove = await StockMove.create({

            type: "adjustment",

            sourceLocation: location,

            destLocation: location,

            items: [
                {
                    product,
                    quantity: difference
                }
            ],

            reference: "Inventory Adjustment",

            notes

        });

        return res.json(
            new ApiResponse(
                201,
                {
                    systemQuantity,
                    countedQuantity,
                    difference,
                    adjustmentMove
                },
                "Adjustment move created"
            )
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }

};