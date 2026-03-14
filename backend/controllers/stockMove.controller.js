import { validateStockMove } from "../services/stockMove.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { StockMove } from "../models/stockMove.model.js";

/* CREATE STOCK MOVE */
export const createStockMove = async (req, res) => {
    try {

        const {
            type,
            sourceLocation,
            destLocation,
            items,
            reference,
            notes
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json(
                new ApiResponse(400, null, "Items required")
            );
        }

        const move = await StockMove.create({
            type,
            sourceLocation,
            destLocation,
            items,
            reference,
            notes,
            createdBy: req.user?._id
        });

        return res.json(
            new ApiResponse(201, move, "Stock move created")
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};
export const validateMove = async (req, res) => {

    try {

        const move = await validateStockMove(req.params.id);

        res.send(
            new ApiResponse(
                200,
                move,
                "Stock move validated successfully"
            )
        );

    } catch (error) {

        res
            .status(400)
            .send(new ApiResponse(400, null, error.message));

    }

};

export const getStockMoves = async (req, res) => {
    try {

        const { type, status } = req.query;

        const filter = {};

        if (type) filter.type = type;
        if (status) filter.status = status;

        const moves = await StockMove.find(filter)
            .populate("sourceLocation", "name")
            .populate("destLocation", "name")
            .populate("items.product", "name sku")
            .sort({ createdAt: -1 });

        return res.json(
            new ApiResponse(200, moves)
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
}; export const getStockMove = async (req, res) => {
    try {

        const move = await StockMove.findById(req.params.id)
            .populate("sourceLocation", "name")
            .populate("destLocation", "name")
            .populate("items.product", "name sku");

        if (!move) {
            return res.status(404).json(
                new ApiResponse(404, null, "Stock move not found")
            );
        }

        return res.json(
            new ApiResponse(200, move)
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};

export const updateStockMove = async (req, res) => {
    try {

        const move = await StockMove.findById(req.params.id);

        if (!move) {
            return res.status(404).json(
                new ApiResponse(404, null, "Move not found")
            );
        }

        if (move.status !== "draft") {
            return res.status(400).json(
                new ApiResponse(400, null, "Only draft moves can be edited")
            );
        }

        Object.assign(move, req.body);

        await move.save();

        return res.json(
            new ApiResponse(200, move, "Stock move updated")
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};