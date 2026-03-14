import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* CREATE CATEGORY */
export const createCategory = async (req, res) => {
    try {

        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json(
                new ApiResponse(400, null, "Category name required")
            );
        }

        const category = await Category.create({
            name,
            description
        });

        return res.json(
            new ApiResponse(201, category, "Category created")
        );

    } catch (error) {

        return res.status(400).json(
            new ApiResponse(400, null, error.message)
        );

    }
};


/* GET ALL CATEGORIES */
export const getCategories = async (req, res) => {
    try {

        const categories = await Category.find().sort({ name: 1 });

        return res.json(
            new ApiResponse(200, categories)
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};


/* GET SINGLE CATEGORY */
export const getCategory = async (req, res) => {
    try {

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json(
                new ApiResponse(404, null, "Category not found")
            );
        }

        return res.json(
            new ApiResponse(200, category)
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};


/* UPDATE CATEGORY */
export const updateCategory = async (req, res) => {
    try {

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        return res.json(
            new ApiResponse(200, category, "Category updated")
        );

    } catch (error) {

        return res.status(400).json(
            new ApiResponse(400, null, error.message)
        );

    }
};


/* DELETE CATEGORY */
export const deleteCategory = async (req, res) => {
    try {

        const productCount = await Product.countDocuments({
            category: req.params.id
        });

        if (productCount > 0) {
            return res.status(400).json(
                new ApiResponse(
                    400,
                    null,
                    "Cannot delete category with products"
                )
            );
        }

        const category = await Category.findByIdAndDelete(req.params.id);

        return res.json(
            new ApiResponse(200, category, "Category deleted")
        );

    } catch (error) {

        return res.status(400).json(
            new ApiResponse(400, null, error.message)
        );

    }
};