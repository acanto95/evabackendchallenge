import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export interface IConfig {
    port: number;
    debugLogging: boolean;
    dbsslconn: boolean;
    jwtSecret: string;
    databaseUrl: string;
    dbEntitiesPath: string[];
    cronJobExpression: string;
}

const isDevMode = process.env.NODE_ENV == 'development';

const config: IConfig = {
    port: +process.env.PORT || 3000,
    debugLogging: isDevMode,
    dbsslconn: !isDevMode,
    jwtSecret: process.env.JWT_SECRET || 'secreteva123',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://spadmin:postgres@localhost/eva2', // change to local postgres db connection
    dbEntitiesPath: [
        ... isDevMode ? ['src/entity/**/*.ts'] : ['dist/entity/**/*.js'],
      ],
    cronJobExpression: '0 * * * *'
};
export { config };