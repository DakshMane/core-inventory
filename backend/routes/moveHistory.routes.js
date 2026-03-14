import express from "express";
import { getMoveHistory } from "../controllers/moveHistory.controller.js";

const router = express.Router();

router.get("/", getMoveHistory);

export default router;
