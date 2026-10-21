import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({ tags: z.array(z.string().min(1).max(60)).min(1).max(20) });

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  for (const tag of parsed.data.tags) revalidateTag(tag, "max");
  return NextResponse.json({ ok: true, tags: parsed.data.tags });
}
