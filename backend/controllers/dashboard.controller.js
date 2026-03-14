import { Product } from "../models/product.model.js";
import { StockQuant } from "../models/stockQuant.model.js";
import { StockMove } from "../models/stockMove.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getDashboard = async (req, res) => {
    try {

        // TOTAL PRODUCTS
        const totalProducts = await Product.countDocuments();

        // TOTAL STOCK
        const totalStockAgg = await StockQuant.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$quantity" }
                }
            }
        ]);

        const totalStock = totalStockAgg[0]?.total || 0;

        // LOW STOCK PRODUCTS
        const lowStockProducts = await Product.aggregate([
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
                    $expr: { $lte: ["$stock.quantity", "$reorderLevel"] }
                }
            },
            {
                $project: {
                    name: 1,
                    sku: 1,
                    reorderLevel: 1,
                    stock: "$stock.quantity"
                }
            }
        ]);

        // PENDING OPERATIONS
        const pendingReceipts = await StockMove.countDocuments({
            type: "receipt",
            status: { $ne: "done" }
        });

        const pendingDeliveries = await StockMove.countDocuments({
            type: "delivery",
            status: { $ne: "done" }
        });

        const pendingTransfers = await StockMove.countDocuments({
            type: "transfer",
            status: { $ne: "done" }
        });

        // LATE OPERATIONS (created more than 3 days ago and not done)
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const lateReceipts = await StockMove.countDocuments({
            type: "receipt",
            status: { $nin: ["done", "cancelled"] },
            createdAt: { $lte: threeDaysAgo }
        });

        const lateDeliveries = await StockMove.countDocuments({
            type: "delivery",
            status: { $nin: ["done", "cancelled"] },
            createdAt: { $lte: threeDaysAgo }
        });

        // WAITING DELIVERIES
        const waitingDeliveries = await StockMove.countDocuments({
            type: "delivery",
            status: "waiting"
        });

        // TOTAL OPERATIONS
        const totalReceiptOps = await StockMove.countDocuments({
            type: "receipt"
        });

        const totalDeliveryOps = await StockMove.countDocuments({
            type: "delivery"
        });

        // RECENT ACTIVITY
        const recentActivity = await StockMove.find()
            .populate("items.product", "name sku")
            .sort({ createdAt: -1 })
            .limit(10);

        // STOCK BY LOCATION
        const stockByLocation = await StockQuant.aggregate([
            {
                $lookup: {
                    from: "locations",
                    localField: "location",
                    foreignField: "_id",
                    as: "location"
                }
            },
            { $unwind: "$location" },
            {
                $group: {
                    _id: "$location.name",
                    totalStock: { $sum: "$quantity" }
                }
            },
            {
                $project: {
                    location: "$_id",
                    totalStock: 1,
                    _id: 0
                }
            }
        ]);

        // TOP MOVING PRODUCTS
        const topMovingProducts = await StockMove.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalMoved: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalMoved: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                    name: "$product.name",
                    sku: "$product.sku",
                    totalMoved: 1
                }
            }
        ]);

        return res.json(
            new ApiResponse(200, {
                kpis: {
                    totalProducts,
                    totalStock,
                    lowStockCount: lowStockProducts.length,
                    pendingReceipts,
                    pendingDeliveries,
                    pendingTransfers,
                    lateReceipts,
                    lateDeliveries,
                    waitingDeliveries,
                    totalReceiptOps,
                    totalDeliveryOps
                },
                lowStockProducts,
                recentActivity,
                stockByLocation,
                topMovingProducts
            })
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};