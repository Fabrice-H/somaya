import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/features/payments/server/registry";
import { handleWebhook } from "@/features/payments/server/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 64 * 1024;

export async function POST(request: Request) {
  const provider = getPaymentProvider("jeko");
  if (!provider) return NextResponse.json({ error: "provider_not_configured" }, { status: 503 });

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) return NextResponse.json({ error: "payload_too_large" }, { status: 413 });

  const parsed = await provider.parseWebhook(rawBody, request.headers);
  if (!parsed.ok) {
    if (parsed.reason === "signature") return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
    if (parsed.reason === "ignored") return NextResponse.json({ received: true, ignored: true });
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  try {
    const outcome = await handleWebhook(provider, parsed.webhook);
    return NextResponse.json({ received: true, outcome });
  } catch (error) {
    console.error("jeko webhook failed", error);
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }
}
