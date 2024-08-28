export const usuarios = (table) => {
    table.increments("id").primary().notNullable();
    table.string("nome").notNullable();
    table.string("numero").notNullable().unique();
    table.timestamps(true, true);
}