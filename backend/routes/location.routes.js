import express from "express";
import {
    createLocation,
    getLocations,
    getLocation,
    updateLocation,
    deleteLocation,
    getLocationTree,
    getLocationStock
} from "../controllers/location.controller.js";

const router = express.Router();

router.post("/", createLocation);

router.get("/", getLocations);

router.get("/tree", getLocationTree);

router.get("/:id", getLocation);

router.patch("/:id", updateLocation);

router.delete("/:id", deleteLocation);

router.get("/:id/stock", getLocationStock);

export default router;