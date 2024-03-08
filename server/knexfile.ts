import type { Knex } from "knex";
import { readFileSync } from "fs";

require("dotenv").config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      port: 5432,
      database: "fav_map_locations",
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: process.env.DATABASE_HOST, // RDS endpoint
      port: 5432, // Default PostgreSQL port
      database: process.env.DATABASE_NAME, // RDS database name
      user: process.env.DATABASE_USERNAME, // RDS username
      password: process.env.DATABASE_PASSWORD, // RDS password
      ssl: {
        rejectUnauthorized: true,
        ca: readFileSync("./rds-global-bundle.pem").toString(),
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },
};

export default config;
