import { validateStockMove } from "../services/stockMove.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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