export const usuarios = (table) => {
    table.increments("id").primary().notNullable();
    table.string("nome").notNullable();
    table.string("chatId").notNullable().unique();
    table.boolean("ativo").notNullable();
    table.timestamps(true, true);
}