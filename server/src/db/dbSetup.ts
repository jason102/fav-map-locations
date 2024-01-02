import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const getDatabase = () => {
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

  const db = new Pool(poolConfig);

  return db;
};
