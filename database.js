import { env } from "./env/environment.js";
import knex from "knex";

export const config = {
    client: env.DATABASE_DIALECT,
    connection: {
        host: env.DATABASE_HOST,
        port: env.DATABASE_PORT,
        user: env.DATABASE_LOGIN,
        password: env.DATABASE_PASSWORD,
        database: env.DATABASE_NAME,
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'js',
        directory: './migrations',
    },
};

export const database = new knex(config);