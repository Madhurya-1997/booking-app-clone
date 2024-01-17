import express, { Request, Response } from "express";
import { HotelSearchResponse } from "../shared/types";
import Hotel from "../models/hotel";

const router = express.Router();

/**
 * /api/hotels/search?city=...&country=...
 */
router.get("/search", async (req: Request, res: Response) => {
    try {
        const pageSize = 5;
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        ) //pageNumber will come from req.query.page, if not then 1

        const skip = (pageNumber - 1) * pageSize;

        const hotels = await Hotel.find({})
            .skip(skip)
            .limit(pageSize);

        const totalHotels = await Hotel.countDocuments();

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


export default router;