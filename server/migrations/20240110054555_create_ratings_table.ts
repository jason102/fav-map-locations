import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("ratings", (table) => {
    table.increments("rating_id").primary();
    table.uuid("user_id").references("user_id").inTable("users").notNullable();
    table
      .string("place_id")
      .references("place_id")
      .inTable("places")
      .notNullable()
      .onDelete("CASCADE");
    table.integer("rating_value").checkBetween([1, 5]).notNullable();
    table.unique(["user_id", "place_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("ratings");
}
