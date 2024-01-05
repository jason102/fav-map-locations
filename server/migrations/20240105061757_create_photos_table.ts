import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("photos", function (table) {
    table.string("photo_file_key", 255).primary();
    table
      .string("place_id", 255)
      .references("place_id")
      .inTable("places")
      .notNullable();
    table.uuid("user_id").references("user_id").inTable("users").notNullable();
    table.timestamp("upload_timestamp").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("photos");
}
