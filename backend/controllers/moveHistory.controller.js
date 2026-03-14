import { StockMove } from "../models/stockMove.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * GET /move-history
 *
 * Returns a flat list of individual product moves derived from validated
 * StockMove documents. Each item in a StockMove becomes its own row so the
 * frontend can display per-product history.
 *
 * Query params:
 *   type   – filter by operation type (receipt | delivery | transfer | adjustment)
 *   from   – ISO date string, include moves on or after this date
 *   to     – ISO date string, include moves on or before this date
 *   search – case-insensitive product name / SKU search
 */
export const getMoveHistory = async (req, res) => {
  try {
    const { type, from, to, search } = req.query;

    // Build filter
    const filter = { status: "done" };
    if (type) filter.type = type;

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // Fetch moves
    let moves = await StockMove.find(filter)
      .populate("sourceLocation", "name")
      .populate("destLocation", "name")
      .populate("items.product", "name sku")
      .sort({ createdAt: -1 })
      .limit(500);

    // Flatten items into individual rows
    let rows = [];
    for (const move of moves) {
      const m = move.toObject();
      for (const item of m.items || []) {
        const productName = item.product?.name || String(item.product);
        const productSku = item.product?.sku || "";

        // Apply search filter on product name / SKU
        if (search) {
          const q = search.toLowerCase();
          if (
            !productName.toLowerCase().includes(q) &&
            !productSku.toLowerCase().includes(q)
          ) {
            continue;
          }
        }

        // Determine qty sign based on operation type
        let qty = item.quantity;
        if (m.type === "delivery") qty = -qty;

        rows.push({
          type: m.type,
          productName,
          from: m.sourceLocation?.name || "—",
          to: m.destLocation?.name || "—",
          qty,
          date: m.createdAt,
          reference: m.reference || null,
        });
      }
    }

    return res.json(new ApiResponse(200, rows));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};
