import { StockQuant } from "../models/stockQuant.model.js";
import { Product } from "../models/product.model.js";
import { StockMove } from "../models/stockMove.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getDashboard = async (req, res) => {
    try {

        // Total Stock
        const totalStock = await StockQuant.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$quantity" }
                }
            }
        ]);

        // Low Stock Products
        const lowStock = await Product.aggregate([
            {
                $lookup: {
                    from: "stockquants",
                    localField: "_id",
                    foreignField: "product",
                    as: "stock"
                }
            },
            { $unwind: "$stock" },
            {
                $match: {
                    $expr: {
                        $lte: ["$stock.quantity", "$reorderLevel"]
                    }
                }
            }
        ]);

        // Pending Receipts
        const pendingReceipts = await StockMove.countDocuments({
            type: "receipt",
            status: { $ne: "done" }
        });

        // Pending Deliveries
        const pendingDeliveries = await StockMove.countDocuments({
            type: "delivery",
            status: { $ne: "done" }
        });

        // Internal Transfers
        const internalTransfers = await StockMove.countDocuments({
            type: "transfer",
            status: { $ne: "done" }
        });

        return res.send(
            new ApiResponse(200, {
                totalStock: totalStock[0]?.total || 0,
                lowStockItems: lowStock.length,
                pendingReceipts,
                pendingDeliveries,
                internalTransfers
            })
        );

    } catch (error) {
        res.status(500).send(new ApiResponse(500, null, error.message));
    }
};