import express from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import { logEvents, logger } from './middlewares/logger';
import { connectDB } from './utils/dbConnection';
import path from 'path';
const PORT = process.env.PORT || 8080;

connectDB();

const corsOptions = {
    origin: process.env.FRONTEND_BASE_URL, //only accept this base url
    credentials: true //checking for http cookies
}

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
// app.use(logger);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// endpoints
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)


// successfull connection to mongoDB
mongoose.connection.once('open', () => {
    console.log(`In ${process.env.NODE_ENV}environment`)
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
});

// connection error to mongoDB
mongoose.connection.on("error", err => {
    console.log(`In ${process.env.NODE_ENV}environment`)
    logEvents(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`,
        'mongoErrLog.log')
})
