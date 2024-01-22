import express, { Request, Response } from "express";
import { HotelSearchResponse } from "../shared/types";
import Hotel from "../models/hotel";
import { param, validationResult } from "express-validator";

const router = express.Router();

/**
 * /api/hotels/search?city=...&country=...
 */
router.get("/search", async (req: Request, res: Response) => {
    try {

        const query = constructSearchQuery(req.query);

        let sortOptions = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 }
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 }
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 }
                break;
        }


        const pageSize = 5;
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        ) //pageNumber will come from req.query.page, if not then 1

        const skip = (pageNumber - 1) * pageSize;

        const hotels = await Hotel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);

        const totalHotels = await Hotel.countDocuments(query);

        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total: totalHotels, // total number of hotels 
                page: pageNumber, // current page we're in 
                pages: Math.ceil(totalHotels / pageSize) // total number of available pages
            }
        }

        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
})

// /api/hotels/12312312312
router.get(
    "/:id",
    [
        param("id").notEmpty().withMessage("Hotel ID is required")
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const hotelId = req.params.id;
        try {
            const hotel = await Hotel.findById(hotelId);

            res.status(200).json(hotel);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    })


const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }

    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star: string) => parseInt(star))
            : parseInt(queryParams.stars);

        constructedQuery.starRating = { $in: starRatings };
    }

    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }

    return constructedQuery;
};

export default router;