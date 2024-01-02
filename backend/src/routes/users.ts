import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { logEvents } from "../middlewares/logger";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post(
    "/register",
    [
        check("firstName", "First Name with 3 or more characters is required ").isLength({ min: 3 }),
        check("firstName", "First Name should be a string").isString(),
        check("lastName", "Last Name with 3 or more characters is required ").isLength({ min: 3 }),
        check("lastName", "Last Name is required").isString(),
        check("email", "Email should be of a valid format").isEmail(),
        check("password", "Password with 6 or more characters is required").isString().isLength({ min: 6 }),
    ],
    async (req: Request, res: Response) => {
        //check for express errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }

        try {
            //check if a user exists
            let user = await User.findOne({ email: req.body.email });

            if (user) {
                return res.status(400).json({ message: "User already exists with same email" })
            }

            //save user to db
            const { email, password, firstName, lastName } = req.body;

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                email,
                password: hashedPassword,
                firstName,
                lastName
            });
            await user.save();

            logEvents(`Newly created user: ${req.path}\t${JSON.stringify(user)}`, "requestLog.log");

            //create the jwt and send it back as an http cookie
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

            return res.status(201).json({ message: "User Registration Done!" });

        } catch (error) {
            console.log(error);
            logEvents(`Error in ${req.path}\t${error}`, "requestLog.log");
            res.status(500).json({ message: "Something went wrong !" })
        }
    });

export default router;

