import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getLowStockAlerts = async (req, res) => {

  try {

    const lowStockProducts = await Product.aggregate([

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
        $match: {
          $expr: {
            $lte: ["$totalStock", "$reorderLevel"]
          }
        }
      },

      {
        $project: {
          name: 1,
          sku: 1,
          reorderLevel: 1,
          totalStock: 1
        }
      }

    ]);

    return res.json(
      new ApiResponse(200, lowStockProducts)
    );

  } catch (error) {

    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    );

  }

};