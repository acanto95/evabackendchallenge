import Koa from 'koa';
import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import winston from 'winston';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import * as PostgressConnectionStringParser from 'pg-connection-string';

import { logger } from './logging';
import { config } from './config';
import { unprotectedRouter } from './unprotectedRoutes';
import { protectedRouter } from './protectedRoutes';

const connectionOptions = PostgressConnectionStringParser.parse(config.databaseUrl);


createConnection({
    type: 'postgres',
    host: connectionOptions.host,
    port: connectionOptions.port,
    username: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database,
    synchronize: true,
    logging: false,
    entities: [
        // 'entity/**/*.js'
        'src/entity/**/*.ts'
    ],
    extra: {
        ssl: config.dbsslconn,
    }
}).then(async connection => {

    const app = new Koa();

    app.use(helmet());

    app.use(cors());

    app.use(logger(winston));

    app.use(bodyParser());

    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    app.use(jwt({ secret: config.jwtSecret }));

    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    app.listen(config.port);

    console.log(`Server running on port ${config.port}`);

}).catch(error => console.log('TypeORM connection error: ', error));