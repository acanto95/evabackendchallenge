"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const controller = require("./controller");
const unprotectedRouter = new koa_router_1.default();
exports.unprotectedRouter = unprotectedRouter;
// Hello World route
unprotectedRouter.get('/', controller.general.helloWorld);
//# sourceMappingURL=unprotectedRoutes.js.map