"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const cors_1 = __importDefault(require("@koa/cors"));
const winston_1 = __importDefault(require("winston"));
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const PostgressConnectionStringParser = __importStar(require("pg-connection-string"));
const logging_1 = require("./logging");
const config_1 = require("./config");
const unprotectedRoutes_1 = require("./unprotectedRoutes");
const protectedRoutes_1 = require("./protectedRoutes");
// Get DB connection options from env variable
const connectionOptions = PostgressConnectionStringParser.parse(config_1.config.databaseUrl);
// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
typeorm_1.createConnection({
    type: 'postgres',
    host: connectionOptions.host,
    port: connectionOptions.port,
    username: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database,
    synchronize: true,
    logging: false,
    entities: config_1.config.dbEntitiesPath,
    extra: {
        ssl: config_1.config.dbsslconn,
    }
}).then(async (connection) => {
    const app = new koa_1.default();
    // Provides important security headers to make your app more secure
    app.use(koa_helmet_1.default());
    // Enable cors with default options
    app.use(cors_1.default());
    // Logger middleware -> use winston as logger (logging.ts with config)
    app.use(logging_1.logger(winston_1.default));
    // Enable bodyParser with default options
    app.use(koa_bodyparser_1.default());
    // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(unprotectedRoutes_1.unprotectedRouter.routes()).use(unprotectedRoutes_1.unprotectedRouter.allowedMethods());
    // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
    // do not protect swagger-json and swagger-html endpoints
    /* app.use(jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] })); */
    // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(protectedRoutes_1.protectedRouter.routes()).use(protectedRoutes_1.protectedRouter.allowedMethods());
    app.listen(config_1.config.port);
    console.log(`Server running on port ${config_1.config.port}`);
}).catch(error => console.log('TypeORM connection error: ', error));
//# sourceMappingURL=server.js.map