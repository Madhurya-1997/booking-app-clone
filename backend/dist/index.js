"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const logger_1 = require("./middlewares/logger");
const dbConnection_1 = require("./utils/dbConnection");
const path_1 = __importDefault(require("path"));
const PORT = process.env.PORT || 8080;
(0, dbConnection_1.connectDB)();
const corsOptions = {
    origin: process.env.FRONTEND_BASE_URL, //only accept this base url
    credentials: true //checking for http cookies
};
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(corsOptions));
// app.use(logger);
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
// endpoints
app.use("/api/users", users_1.default);
app.use("/api/auth", auth_1.default);
// successfull connection to mongoDB
mongoose_1.default.connection.once('open', () => {
    console.log(`In ${process.env.NODE_ENV}environment`);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
// connection error to mongoDB
mongoose_1.default.connection.on("error", err => {
    console.log(`In ${process.env.NODE_ENV}environment`);
    (0, logger_1.logEvents)(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});
