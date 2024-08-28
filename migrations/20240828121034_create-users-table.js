import { usuarios } from "../models/users.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('usuarios', (table) => usuarios(table));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down (knex) {
    await knex.schema.dropTable('usuarios');
};
