import { logEvents } from "./logger"
import { Request, Response, NextFunction } from "express";


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errorLog.log');
    console.log(err.message);

    const status = res.statusCode ? res.statusCode : 500;

    res.status(status).json({ message: err.message });

    next();
}