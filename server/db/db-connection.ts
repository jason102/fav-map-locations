import { Pool } from "pg";

export const setupDatabase = () => {
  const db = new Pool({
    connectionString: process.env.DATABASE_URI,
  });

  return db;
};
