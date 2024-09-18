import { env } from "./env/environment.js";
import knex from "knex";

export const config = {
    client: 'sqlite3',
    connection: {
        filename: './store.db'
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'js',
        directory: './migrations',
    }
};

export const database = new knex(config);

export async function realizarMigrations() {
    return await database.migrate.latest({
        directory: [
            './migrations',
        ],
        sortDirsSeparately: true,
        tableName: "knex_migrations"
    });
}