import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      connectionString: process.env.LOCALHOST_DATABASE_URL,
    };

export const db = new Pool(poolConfig);
