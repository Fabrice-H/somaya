import { POST as handleJekoWebhook } from "@/app/api/payments/jeko/webhook/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleJekoWebhook(request);
}
