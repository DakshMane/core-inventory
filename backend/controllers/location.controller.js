import { Location } from "../models/location.model.js";
import { StockQuant } from "../models/stockQuant.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* CREATE LOCATION */
export const createLocation = async (req, res) => {
    try {

        const { name, type, parentLocation } = req.body;

        const location = await Location.create({
            name,
            type,
            parentLocation
        });

        return res.json(
            new ApiResponse(201, location, "Location created")
        );

    } catch (error) {

        return res.status(400).json(
            new ApiResponse(400, null, error.message)
        );

    }
};


/* GET ALL LOCATIONS */
export const getLocations = async (req, res) => {
    try {

        const locations = await Location.find()
            .populate("parentLocation", "name type");

        return res.json(
            new ApiResponse(200, locations)
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};


/* GET SINGLE LOCATION */
export const getLocation = async (req, res) => {
    try {

        const location = await Location.findById(req.params.id)
            .populate("parentLocation", "name type");

        if (!location) {
            return res.status(404).json(
                new ApiResponse(404, null, "Location not found")
            );
        }

        return res.json(
            new ApiResponse(200, location)
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};


/* UPDATE LOCATION */
export const updateLocation = async (req, res) => {
    try {

        const location = await Location.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        return res.json(
            new ApiResponse(200, location, "Location updated")
        );

    } catch (error) {

        return res.status(400).json(
            new ApiResponse(400, null, error.message)
        );

    }
};


/* DELETE LOCATION */
export const deleteLocation = async (req, res) => {
    try {

        const location = await Location.findByIdAndDelete(req.params.id);

        return res.json(
            new ApiResponse(200, location, "Location deleted")
        );

    } catch (error) {

        return res.status(400).json(
            new ApiResponse(400, null, error.message)
        );

    }
};
/* LOCATION TREE */
export const getLocationTree = async (req, res) => {
    try {

        const locations = await Location.find();

        const map = {};
        const roots = [];

        locations.forEach(loc => {
            map[loc._id] = { ...loc.toObject(), children: [] };
        });

        locations.forEach(loc => {
            if (loc.parentLocation) {
                map[loc.parentLocation]?.children.push(map[loc._id]);
            } else {
                roots.push(map[loc._id]);
            }
        });

        return res.json(
            new ApiResponse(200, roots)
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};
/* STOCK IN LOCATION */
export const getLocationStock = async (req, res) => {
    try {

        const stock = await StockQuant.find({
            location: req.params.id
        })
            .populate("product", "name sku");

        return res.json(
            new ApiResponse(200, stock)
        );

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, null, error.message)
        );

    }
};