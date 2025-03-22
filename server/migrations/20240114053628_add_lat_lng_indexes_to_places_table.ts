import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("places", (table) => {
    table.index("latitude", "idx_places_latitude");
    table.index("longitude", "idx_places_longitude");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("places", (table) => {
    table.dropIndex("latitude", "idx_places_latitude");
    table.dropIndex("longitude", "idx_places_longitude");
  });
}
