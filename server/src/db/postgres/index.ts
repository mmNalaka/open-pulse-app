import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Create postgres pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "",
});

// Initialize Drizzle with pool and schema
export const db = drizzle(pool, { schema });

// Export types
export type Database = typeof db;
export type Schema = typeof schema;
