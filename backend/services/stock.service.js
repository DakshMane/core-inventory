import { StockQuant } from "../models/stockQuant.model.js";

export async function updateStock(product, location, qty, session) {

    let quant = await StockQuant.findOne({
        product,
        location
    }).session(session);

    if (!quant) {
        quant = new StockQuant({
            product,
            location,
            quantity: 0
        });
    }

    quant.quantity += qty;

    if (quant.quantity < 0) {
        throw new Error("Insufficient stock");
    }

    await quant.save({ session });

    return quant;
}

export const validateStockMove = async (moveId) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const move = await StockMove.findById(moveId).session(session);

        if (!move) throw new Error("Move not found");

        if (move.status === "done") {
            throw new Error("Move already validated");
        }

        for (const item of move.items) {

            const { product, quantity } = item;

            switch (move.type) {

                case "receipt":

                    await updateStock(
                        product,
                        move.destLocation,
                        quantity,
                        session
                    );

                    break;

                case "delivery":

                    await updateStock(
                        product,
                        move.sourceLocation,
                        -quantity,
                        session
                    );

                    break;

                case "transfer":

                    await updateStock(
                        product,
                        move.sourceLocation,
                        -quantity,
                        session
                    );

                    await updateStock(
                        product,
                        move.destLocation,
                        quantity,
                        session
                    );

                    break;

                case "adjustment":

                    await updateStock(
                        product,
                        move.destLocation,
                        quantity,
                        session
                    );

                    break;

            }

        }

        move.status = "done";

        await move.save({ session });

        await session.commitTransaction();

        session.endSession();

        return move;

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        throw error;

    }

};