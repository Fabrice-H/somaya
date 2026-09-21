import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Connection string from environment variable
const connectionString = process.env.DATABASE_URL!;

// Create Neon SQL client (HTTP-based, perfect for serverless)
const sql = neon(connectionString);

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export schema for use in queries
export * from "./schema";

// Type helper for database instance
export type Database = typeof db;
