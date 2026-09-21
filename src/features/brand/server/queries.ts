import "server-only";
import { asc } from "drizzle-orm";
import { aboutCollections, db } from "@/shared/lib/db";
import { assertAdmin } from "@/features/auth/server/session";
import type { AboutCollectionData } from "../types";
import { toAboutCollectionData } from "../utils";

export async function getAboutCollections(): Promise<AboutCollectionData[]> {
  await assertAdmin();
  const rows = await db.query.aboutCollections.findMany({ orderBy: [asc(aboutCollections.sortOrder)] });
  return rows.map(toAboutCollectionData);
}
