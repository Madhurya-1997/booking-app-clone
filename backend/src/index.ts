import express from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from "./routes/users";
import { logEvents, logger } from './middlewares/logger';
import { connectDB } from './utils/dbConnection';
const PORT = process.env.PORT || 8080;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(logger);

// endpoints
app.use("/api/users", userRoutes)


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
