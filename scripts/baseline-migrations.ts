import { config } from "dotenv";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

type JournalEntry = { idx: number; when: number; tag: string };

const MIGRATIONS_DIR = path.join(process.cwd(), "drizzle");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL manquante");
  const sql = neon(connectionString);

  const journal = JSON.parse(readFileSync(path.join(MIGRATIONS_DIR, "meta", "_journal.json"), "utf8")) as {
    entries: JournalEntry[];
  };
  const upTo = Number(process.argv[2] ?? journal.entries.at(-1)?.idx ?? -1);

  await sql`CREATE SCHEMA IF NOT EXISTS "drizzle"`;
  await sql`CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
    id SERIAL PRIMARY KEY,
    hash text NOT NULL,
    created_at bigint
  )`;

  const existing = await sql`SELECT hash FROM "drizzle"."__drizzle_migrations"`;
  const known = new Set(existing.map((row) => row.hash as string));

  let inserted = 0;
  for (const entry of journal.entries) {
    if (entry.idx > upTo) break;
    const content = readFileSync(path.join(MIGRATIONS_DIR, `${entry.tag}.sql`), "utf8");
    const hash = createHash("sha256").update(content).digest("hex");
    if (known.has(hash)) {
      console.log(`= ${entry.tag} déjà enregistrée`);
      continue;
    }
    await sql`INSERT INTO "drizzle"."__drizzle_migrations" (hash, created_at) VALUES (${hash}, ${entry.when})`;
    console.log(`+ ${entry.tag} marquée comme appliquée`);
    inserted += 1;
  }

  console.log(`\nTerminé : ${inserted} migration(s) enregistrée(s), aucune table modifiée.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
