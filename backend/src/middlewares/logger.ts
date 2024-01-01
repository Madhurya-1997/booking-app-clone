import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import path from "path";
import { Request, Response, NextFunction } from "express";

import fs from "fs";
const fsPromises = fs.promises;


export const logEvents = async (message: string, logFileName: string) => {
    const dateTime = format(new Date(), 'ddMMyyyy\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {

        if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
            fs.mkdirSync(path.join(__dirname, '..', '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', '..', 'logs', logFileName), logItem);
    } catch (err) {
        console.log(err);
    }
}

export const logger = (req: Request, res: Response, next: NextFunction) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'requestLog.log');
    console.log(`${req.method}\t${req.path}\t${req.body}`);
    next();
}
