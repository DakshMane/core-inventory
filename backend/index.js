import express from "express";
import { connectDB } from "./db/db.js";
import { app } from "./app.js";
import "dotenv/config.js"

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED !!", err);
  });
