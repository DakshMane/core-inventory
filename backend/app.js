import express from "express";
import { ApiResponse } from "./utils/ApiResponse.js";
import userRouter from "./routes/user.routes.js";

const app = express()
app.use(express.json())


app.use("/api/v1/user" , userRouter)

export {app}
