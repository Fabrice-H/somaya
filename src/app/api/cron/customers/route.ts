import { NextResponse } from "next/server";
import { detectInactiveCustomers } from "@/features/automations/server/inactive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const report = await detectInactiveCustomers();
    return NextResponse.json({ ok: true, report, at: new Date().toISOString() });
  } catch (error) {
    console.error("customers cron failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
