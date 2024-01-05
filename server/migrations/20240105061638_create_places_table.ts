import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("places", function (table) {
    table.string("place_id", 255).primary();
    table.uuid("user_id").references("user_id").inTable("users").notNullable();
    table.string("place_name", 255).notNullable();
    table.string("place_address", 255).notNullable();
    table.double("latitude").notNullable();
    table.double("longitude").notNullable();
    table
      .specificType("photo_urls", "JSONB[]")
      .defaultTo(knex.raw("ARRAY[]::JSONB[]"));
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("places");
}
