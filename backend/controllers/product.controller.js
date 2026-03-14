import { Product } from "../models/product.model.js";
import { StockQuant } from "../models/stockQuant.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { StockMove } from "../models/stockMove.model.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

/**
 * Resolve a category value that may be a name string or already an ObjectId.
 * Returns the ObjectId, or undefined if nothing was provided.
 */
async function resolveCategoryId(category) {
    if (!category) return undefined;
    // If it's already a valid ObjectId string, use it directly
    if (mongoose.Types.ObjectId.isValid(category)) return category;
    // Otherwise treat it as a category name and look it up
    const found = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, "i") } });
    if (!found) throw new Error(`Category "${category}" not found`);
    return found._id;
}

/* CREATE PRODUCT */
export const createProduct = async (req, res) => {
    try {

        const {
            name,
            sku,
            category,
            unitOfMeasure,
            reorderLevel,
            costPrice,
            salePrice,
            initialStock,
            location
        } = req.body;

        if (!name || !sku) {
            return res.status(400).json(
                new ApiResponse(400, null, "Name and SKU are required")
            );
        }

        const resolvedCategory = await resolveCategoryId(category);

        const product = await Product.create({
            name,
            sku,
            category: resolvedCategory,
            unitOfMeasure,
            reorderLevel,
            costPrice,
            salePrice
        });

        // handle optional initial stock
        if (initialStock && location) {
            await StockQuant.create({
                product: product._id,
                location,
                quantity: initialStock
            });
        }

        return res.json(
            new ApiResponse(201, product, "Product created successfully")
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};

/* GET ALL PRODUCTS */
export const getProducts = async (req, res) => {
    try {

        const { category } = req.query;

        const match = {};
        if (category) match.category = category;

        const products = await Product.aggregate([
            { $match: match },

            {
                $lookup: {
                    from: "stockquants",
                    localField: "_id",
                    foreignField: "product",
                    as: "stock"
                }
            },

            {
                $addFields: {
                    totalStock: {
                        $ifNull: [{ $sum: "$stock.quantity" }, 0]
                    }
                }
            },

            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },

            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {
                    name: 1,
                    sku: 1,
                    unitOfMeasure: 1,
                    reorderLevel: 1,
                    costPrice: 1,
                    salePrice: 1,
                    totalStock: 1,
                    category: "$category.name"
                }
            }

        ]);

        return res.json(
            new ApiResponse(200, products)
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};

/* GET SINGLE PRODUCT */
export const getProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id)
            .populate("category", "name");

        if (!product) {
            return res.status(404).json(
                new ApiResponse(404, null, "Product not found")
            );
        }

        return res.json(
            new ApiResponse(200, product)
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};


/* UPDATE PRODUCT */
export const updateProduct = async (req, res) => {
    try {

        const updateData = { ...req.body };

        // Resolve category name → ObjectId if provided as a string
        if (updateData.category) {
            updateData.category = await resolveCategoryId(updateData.category);
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        return res.json(
            new ApiResponse(200, product, "Product updated")
        );

    } catch (error) {

        return res.status(400).json(
            new ApiResponse(400, null, error.message)
        );

    }
};


/* DELETE PRODUCT */
export const deleteProduct = async (req, res) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id);

        return res.json(
            new ApiResponse(200, product, "Product deleted")
        );

    } catch (error) {

        return res.status(400).json(
            new ApiResponse(400, null, error.message)
        );

    }
};


/* GET PRODUCT STOCK BY LOCATION */
export const getProductStock = async (req, res) => {
    try {

        const stock = await StockQuant.find({
            product: req.params.id
        })
            .populate("location", "name type");

        return res.json(
            new ApiResponse(200, stock)
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};


/* PRODUCT MOVE HISTORY */

export const getProductMoves = async (req, res) => {

    try {

        const productId = req.params.id;

        const moves = await StockMove.find({
            "items.product": productId
        })
            .populate("sourceLocation", "name type")
            .populate("destLocation", "name type")
            .populate("items.product", "name sku")
            .sort({ createdAt: -1 });

        const history = moves.map(move => {

            const item = move.items.find(
                i => i.product._id.toString() === productId
            );

            let quantityChange = item.quantity;

            if (move.type === "delivery") {
                quantityChange = -item.quantity;
            }

            if (move.type === "transfer") {

                if (move.sourceLocation) {
                    quantityChange = -item.quantity;
                }

                if (move.destLocation) {
                    quantityChange = item.quantity;
                }

            }

            return {
                type: move.type,
                status: move.status,
                reference: move.reference,
                quantity: quantityChange,
                sourceLocation: move.sourceLocation,
                destLocation: move.destLocation,
                createdAt: move.createdAt
            };

        });

        return res.json(
            new ApiResponse(200, history)
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }

};