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
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/login", [
    (0, express_validator_1.check)("email", "Email should be of a valid format").isEmail(),
    (0, express_validator_1.check)("password", "Password with 6 or more characters is required").isString().isLength({ min: 6 })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check for express errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            (0, logger_1.logEvents)(`User does not exist\t ${req.path}\t${JSON.stringify(req.body)}`, "requestLog.log");
            return res.status(400).json({ message: "User does not exist" });
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            (0, logger_1.logEvents)(`Invalid password\t ${req.path}\t${JSON.stringify(req.body)}`, "requestLog.log");
            return res.status(400).json({ message: "User does not exist" });
        }
        //create access token and send it back to http cookie as response
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
        return res.status(200).json({ userId: user._id });
    }
    catch (error) {
        console.log(error);
        (0, logger_1.logEvents)(`Error in ${req.path}\t${error}`, "requestLog.log");
        res.status(500).json({ message: "Something went wrong !" });
    }
}));
router.get("/validate-token", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ userId: req.userId });
}));
router.post("/logout", (req, res) => {
    res.cookie("auth_token", "", {
        expires: new Date(0)
    });
    res.send();
});
exports.default = router;
