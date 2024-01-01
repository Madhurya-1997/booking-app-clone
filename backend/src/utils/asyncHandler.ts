import { Request, Response, NextFunction } from "express";
import { logEvents } from "../middlewares/logger";

export default (fn: Function) =>
    (req: Request, res: Response, next: NextFunction) =>
        fn(req, res, next)
            .catch((err: Error) => {
                logEvents(`Error in ${req.path}\t${err}`, "requestLog.log");
                next(err)
            });

