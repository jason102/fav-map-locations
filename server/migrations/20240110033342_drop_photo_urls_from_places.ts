import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("places", (table) => {
    table.dropColumn("photo_urls");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("places", (table) => {
    table
      .specificType("photo_urls", "JSONB[]")
      .defaultTo(knex.raw("ARRAY[]::JSONB[]"));
  });
}
