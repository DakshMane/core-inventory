import express from "express";
import { ApiResponse } from "./utils/ApiResponse.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import stockMoveRoutes from "./routes/stockMove.routes.js";

const app = express()
app.use(express.json())
app.get("/", (req, res) => {
  res.json(new ApiResponse(200, { message: "API running" }));
});

app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/api/v1/stockMoves", stockMoveRoutes);

export { app }
