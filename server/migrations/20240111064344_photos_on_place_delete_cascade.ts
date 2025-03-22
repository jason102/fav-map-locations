import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("photos", (table) => {
    table.dropForeign("place_id");
    table
      .foreign("place_id")
      .references("place_id")
      .inTable("places")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("photos", (table) => {
    table.dropForeign("place_id");
    table.foreign("place_id").references("place_id").inTable("places");
  });
}
