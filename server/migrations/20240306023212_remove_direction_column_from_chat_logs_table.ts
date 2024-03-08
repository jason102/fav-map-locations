import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("chat_logs", (table) => {
    table.dropColumn("direction");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("chat_logs", (table) => {
    table.integer("direction").checkBetween([1, 2]).notNullable();
  });
}
