"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../middlewares/logger");
exports.default = (fn) => (req, res, next) => fn(req, res, next)
    .catch((err) => {
    (0, logger_1.logEvents)(`Error in ${req.path}\t${err}`, "requestLog.log");
    next(err);
});
