import { Product } from "../models/product.model.js";
import { StockQuant } from "../models/stockQuant.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* CREATE PRODUCT */
export const createProduct = async (req, res) => {
    try {

        const { name, sku, category, unitOfMeasure, reorderLevel } = req.body;

        const product = await Product.create({
            name,
            sku,
            category,
            unitOfMeasure,
            reorderLevel
        });

        return res.json(
            new ApiResponse(201, product, "Product created")
        );

    } catch (error) {

        return res.status(400).json(
            new ApiResponse(400, null, error.message)
        );

    }
};


/* GET ALL PRODUCTS */
export const getProducts = async (req, res) => {
    try {

        const { category } = req.query;

        const matchStage = {};
        if (category) matchStage.category = category;

        const products = await Product.aggregate([

            {
                $match: matchStage
            },

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
                        $sum: "$stock.quantity"
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
                    totalStock: 1,
                    "category.name": 1
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

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
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