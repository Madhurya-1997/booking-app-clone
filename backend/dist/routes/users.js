"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const logger_1 = require("../middlewares/logger");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
router.post("/register", [
    (0, express_validator_1.check)("firstName", "First Name with 3 or more characters is required ").isLength({ min: 3 }),
    (0, express_validator_1.check)("firstName", "First Name should be a string").isString(),
    (0, express_validator_1.check)("lastName", "Last Name with 3 or more characters is required ").isLength({ min: 3 }),
    (0, express_validator_1.check)("lastName", "Last Name is required").isString(),
    (0, express_validator_1.check)("email", "Email should be of a valid format").isEmail(),
    (0, express_validator_1.check)("password", "Password with 6 or more characters is required").isString().isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check for express errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    try {
        //check if a user exists
        let user = yield user_1.default.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ message: "User already exists with same email" });
        }
        //save user to db
        const { email, password, firstName, lastName } = req.body;
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        user = new user_1.default({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
        yield user.save();
        (0, logger_1.logEvents)(`Newly created user: ${req.path}\t${JSON.stringify(user)}`, "requestLog.log");
        //create the jwt and send it back as an http cookie
        const token = jsonwebtoken_1.default.sign({
            userId: user._id
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d"
        });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(201).json({ message: "User Registration Done!" });
    }
    catch (error) {
        console.log(error);
        (0, logger_1.logEvents)(`Error in ${req.path}\t${error}`, "requestLog.log");
        res.status(500).json({ message: "Something went wrong !" });
    }
}));
exports.default = router;
