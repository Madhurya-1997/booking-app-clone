import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { logEvents } from "../middlewares/logger";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post(
    "/login",
    [
        check("email", "Email should be of a valid format").isEmail(),
        check("password", "Password with 6 or more characters is required").isString().isLength({ min: 6 })
    ],
    async (req: Request, res: Response) => {
        //check for express errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }


        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                logEvents(`User does not exist\t ${req.path}\t${JSON.stringify(req.body)}`, "requestLog.log");
                return res.status(400).json({ message: "User does not exist" })
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                logEvents(`Invalid password\t ${req.path}\t${JSON.stringify(req.body)}`, "requestLog.log");
                return res.status(400).json({ message: "User does not exist" })
            }

            //create access token and send it back to http cookie as response
            const token = jwt.sign({
                userId: user._id
            }, process.env.JWT_SECRET_KEY as string,
                {
                    expiresIn: "1d"
                });

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(200).json({ userId: user._id });


        } catch (error) {
            console.log(error);
            logEvents(`Error in ${req.path}\t${error}`, "requestLog.log");
            res.status(500).json({ message: "Something went wrong !" })
        }
    });

export default router;