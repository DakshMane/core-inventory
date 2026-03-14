import express from "express";
import { ApiResponse } from "./utils/ApiResponse.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import stockMoveRoutes from "./routes/stockMove.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js"
import categoryRoutes from "./routes/category.routes.js";
import locationRoutes from "./routes/location.routes.js";
import adjustmentRoutes from "./routes/adjustment.routes.js";
import cors from "cors"

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}))

app.use(express.json())

app.get("/", (req, res) => {
  res.json(new ApiResponse(200, { message: "API running" }));
});


app.use("/api/v1/user", userRoutes)

app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/api/v1/stockMoves", stockMoveRoutes);

app.use("/api/v1/products", productRoutes);

app.use("/api/v1/categories", categoryRoutes);

app.use("/api/locations", locationRoutes);

app.use("/api/adjustments", adjustmentRoutes);

export { app }
