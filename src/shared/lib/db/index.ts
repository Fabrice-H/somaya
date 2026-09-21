import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { serverEnv } from "../env";
import * as schema from "./schema";

export const db = drizzle(neon(serverEnv().DATABASE_URL), { schema });

export * from "./schema";

export type Database = typeof db;
