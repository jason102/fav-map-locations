import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

// TODO: I had to create a function because dotenv.config() was not loading the env vars
// in time for when this code ran. The problem is that each time this function is called,
// I'm creating an additional instance of a Pool...
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
