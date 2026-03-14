import express from "express";
import { getUoms, createUom } from "../controllers/settings.controller.js";

const router = express.Router();

router.get("/", getUoms);
router.post("/", createUom);

export default router;
