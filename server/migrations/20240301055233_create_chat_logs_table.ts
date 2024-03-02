import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("chat_logs", (table) => {
    table.string("chat_id", 255).primary();
    table
      .string("place_id", 255)
      .references("place_id")
      .inTable("places")
      .notNullable()
      .onDelete("CASCADE");
    table.integer("chat_status").notNullable();
    table.integer("content_type").notNullable();
    table.string("sender_id", 255).notNullable();
    table.integer("direction").checkBetween([1, 2]).notNullable();
    table.string("content", 255).notNullable();
    table.timestamp("created_time").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("chat_logs");
}
