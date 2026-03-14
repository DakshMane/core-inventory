import express from "express";
import { ApiResponse } from "./utils/ApiResponse.js";

const app = express()
app.use(express.json())
app.get("/" , (req ,res) => {

  res.send(new ApiResponse(200 , req , "Hello world "))

})

export {app}
