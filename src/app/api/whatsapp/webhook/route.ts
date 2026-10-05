import { NextResponse } from "next/server";
import { WHATSAPP_MAX_BODY_BYTES, WHATSAPP_SIGNATURE_HEADER } from "@/features/whatsapp/constants";
import { getWebhookSecrets } from "@/features/whatsapp/server/config";
import { applyStatuses, storeInbound } from "@/features/whatsapp/server/service";
import { parseWebhookPayload, verifyChallenge, verifyMetaSignature } from "@/features/whatsapp/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secrets = getWebhookSecrets();
  if (!secrets) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const result = verifyChallenge(new URL(request.url).searchParams, secrets.verifyToken);
  if (!result.ok) return NextResponse.json({ error: "verification_failed" }, { status: 403 });
  return new Response(result.challenge, { status: 200, headers: { "content-type": "text/plain" } });
}

export async function POST(request: Request) {
  const secrets = getWebhookSecrets();
  if (!secrets) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const rawBody = await request.text();
  if (rawBody.length > WHATSAPP_MAX_BODY_BYTES)
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  if (!verifyMetaSignature(secrets.appSecret, rawBody, request.headers.get(WHATSAPP_SIGNATURE_HEADER))) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const parsed = parseWebhookPayload(payload);
  const outcomes: string[] = [];
  try {
    for (const message of parsed.messages) outcomes.push(await storeInbound(message));
    if (parsed.statuses.length > 0) await applyStatuses(parsed.statuses);
  } catch (error) {
    console.error("whatsapp webhook failed", error);
  }
  return NextResponse.json({ received: true, messages: outcomes, statuses: parsed.statuses.length });
}
