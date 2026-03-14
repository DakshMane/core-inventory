
import { StockMove } from "../models/stockMove.model.js";
import { updateStock } from "./stock.service.js";

export const validateStockMove = async (moveId) => {

  const move = await StockMove.findById(moveId);

  if (!move) {
    throw new Error("Stock move not found");
  }

  if (move.status === "done") {
    throw new Error("Already validated");
  }

  for (const item of move.items) {

    const { product, quantity } = item;

    if (move.type === "receipt") {

      await updateStock(product, move.destLocation, quantity);

    }

    if (move.type === "delivery") {

      await updateStock(product, move.sourceLocation, -quantity);

    }

    if (move.type === "transfer") {

      await updateStock(product, move.sourceLocation, -quantity);

      await updateStock(product, move.destLocation, quantity);

    }

    if (move.type === "adjustment") {

      await updateStock(product, move.destLocation, quantity);

    }

  }

  move.status = "done";

  await move.save();

  return move;
};