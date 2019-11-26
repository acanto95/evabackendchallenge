"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const isDevMode = process.env.NODE_ENV == 'development';
const config = {
    port: +process.env.PORT || 3000,
    debugLogging: isDevMode,
    dbsslconn: !isDevMode,
    jwtSecret: process.env.JWT_SECRET || 'ne6vQHdSGufT7HuG',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://spadmin:postgres@localhost/eva2',
    dbEntitiesPath: [
        ...isDevMode ? ['src/entity/**/*.ts'] : ['dist/entity/**/*.js'],
    ],
    cronJobExpression: '0 * * * *'
};
exports.config = config;
//# sourceMappingURL=config.js.map