import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 //10mb max,
    }
})
const MAX_NUMBER_OF_IMAGES = 6;

router.post(
    "/",
    verifyToken,
    upload.array("imageFiles", MAX_NUMBER_OF_IMAGES),
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];
            console.log(imageFiles);
            const newHotel: HotelType = req.body;

            // upload images to cloudinary
            const uploadedFilesPromises = imageFiles.map(async (image) => {
                const base64 = Buffer.from(image.buffer).toString("base64");
                let dataUri = `data:${image.mimetype};base64,${base64}`;

                const response = await cloudinary.v2.uploader.upload(dataUri);

                return response.url;
            });
            const uploadedFileUrls = await Promise.all(uploadedFilesPromises);

            // if upload is success, add URLs to newHotel
            newHotel.imageUrls = uploadedFileUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            // save hotel in DB
            const hotel = new Hotel(newHotel);

            // return 201 response code
            res.status(201).json({ message: hotel })
        } catch (error) {
            console.log("Error creating hotel: ", error)
            res.status(500).json({ message: "Something went wrong" });
        }
    })

export default router;