import { GET as handleGet, POST as handlePost } from "@/app/api/whatsapp/webhook/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleGet(request);
}

export async function POST(request: Request) {
  return handlePost(request);
}
