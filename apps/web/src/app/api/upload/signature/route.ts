import { NextResponse } from "next/server";
import { requireAdmin } from "@/features/auth/server/session";
import { uploadSignatureSchema } from "@/features/media/schemas";
import { signUpload } from "@/features/media/server/cloudinary";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const parsed = uploadSignatureSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dossier non autorisé" }, { status: 400 });

  try {
    return NextResponse.json(signUpload(parsed.data.folder, parsed.data.resourceType));
  } catch {
    return NextResponse.json({ error: "Erreur lors de la génération de la signature" }, { status: 500 });
  }
}
