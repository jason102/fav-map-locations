import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(`
    CREATE VIEW place_with_average_rating AS
    SELECT
        p.place_id,
        p.user_id,
        p.place_name,
        p.place_address,
        p.latitude,
        p.longitude,
        p.created_at,
        CAST(COALESCE(AVG(r.rating_value), 0) AS DOUBLE PRECISION) AS average_rating
    FROM
        places p
    LEFT JOIN
        ratings r ON p.place_id = r.place_id
    GROUP BY
        p.place_id, p.place_name, p.place_address, p.latitude, p.longitude, p.created_at;
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.raw(`DROP VIEW IF EXISTS place_with_average_rating`);
}
