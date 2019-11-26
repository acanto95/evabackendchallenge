"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const winston_1 = __importDefault(require("winston"));
function logger(winstonInstance) {
    winstonInstance.configure({
        level: config_1.config.debugLogging ? 'debug' : 'info',
        transports: [
            //
            // - Write all logs error (and below) to `error.log`.
            new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
            //
            // - Write to all logs with specified level to console.
            new winston_1.default.transports.Console({ format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()) })
        ]
    });
    return async (ctx, next) => {
        const start = new Date().getTime();
        await next();
        const ms = new Date().getTime() - start;
        let logLevel;
        if (ctx.status >= 500) {
            logLevel = 'error';
        }
        else if (ctx.status >= 400) {
            logLevel = 'warn';
        }
        else if (ctx.status >= 100) {
            logLevel = 'info';
        }
        const msg = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;
        winstonInstance.log(logLevel, msg);
    };
}
exports.logger = logger;
//# sourceMappingURL=logging.js.map