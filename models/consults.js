export const consultas = (table) => {
    table.increments("id").primary().notNullable();
    table.string("numero").notNullable().unique();
    table.timestamps(true, true);
}