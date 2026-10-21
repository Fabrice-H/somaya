import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof connect>;

function connect() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL manquante");
  return drizzle(neon(url), { schema });
}

let instance: Db | null = null;

export const db: Db = new Proxy({} as Db, {
  get(_target, property) {
    instance ??= connect();
    const value = Reflect.get(instance, property);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export * from "./schema";

export type Database = Db;
