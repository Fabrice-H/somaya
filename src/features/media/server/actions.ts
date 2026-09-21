"use server";

import { z } from "zod";
import { requireAdmin } from "@/features/auth/server/session";
import { getPublicIdFromUrl, isManagedPublicId } from "../utils";
import type { DeleteResult } from "../types";
import { destroyAsset } from "./cloudinary";

const urlSchema = z.string().min(1).max(1000);

export async function deleteImage(url: string): Promise<DeleteResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  const parsed = urlSchema.safeParse(url);
  if (!parsed.success) return { success: false, error: "URL invalide" };

  const publicId = getPublicIdFromUrl(parsed.data);
  if (!publicId || !isManagedPublicId(publicId)) return { success: true };

  try {
    await destroyAsset(publicId);
    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors de la suppression" };
  }
}
