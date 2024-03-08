import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", function (table) {
    table.uuid("user_id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("username", 255).notNullable().unique();
    table.string("email", 255).notNullable().unique();
    table.string("hashed_password", 255).notNullable();
    table.string("profile_image", 500);
    table.timestamp("last_login").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
