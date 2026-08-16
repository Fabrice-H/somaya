"use server";

import { requireAdmin } from "@/lib/auth/actions";
import {
  uploadImage as cloudinaryUpload,
  uploadVideo as cloudinaryUploadVideo,
  deleteImage as cloudinaryDelete,
  getPublicIdFromUrl,
} from "@/lib/cloudinary";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
];
const MAX_SIZE = 15 * 1024 * 1024; // 15MB to allow large HEIC files before compression

export async function uploadImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé" };

  const file = formData.get("file") as File;
  const bucket = formData.get("bucket") as string;

  if (!file) {
    return { error: "Aucun fichier fourni" };
  }

  // Check MIME type or file extension (browsers sometimes don't report HEIC correctly)
  const fileName = file.name.toLowerCase();
  const isHeic = fileName.endsWith(".heic") || fileName.endsWith(".heif");
  const isValidType = ALLOWED_TYPES.includes(file.type) || isHeic;

  if (!isValidType) {
    return {
      error: `Type de fichier non supporté. Formats acceptés: JPG, PNG, WebP, GIF, HEIC`,
    };
  }

  if (file.size > MAX_SIZE) {
    return { error: "Fichier trop volumineux (max 15 MB)" };
  }

  // Map bucket names to Cloudinary folders
  const folderMap: Record<string, "products" | "categories" | "store" | "featured" | "lots"> = {
    products: "products",
    categories: "categories",
    store: "store",
    featured: "featured",
    lots: "lots",
  };

  const folder = folderMap[bucket];
  if (!folder) {
    return { error: "Bucket invalide" };
  }

  // Upload to Cloudinary
  const result = await cloudinaryUpload(file, folder);

  if (!result.success || !result.url) {
    return { error: result.error || "Erreur lors de l'upload" };
  }

  return { url: result.url };
}

export async function deleteImage(
  url: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  // Extract public ID from Cloudinary URL
  const publicId = getPublicIdFromUrl(url);

  if (!publicId) {
    // If not a Cloudinary URL, just return success
    console.warn("Could not extract public ID from URL:", url);
    return { success: true };
  }

  const result = await cloudinaryDelete(publicId);

  if (!result.success) {
    console.error("Delete error:", result.error);
    return { success: false, error: "Erreur lors de la suppression" };
  }

  return { success: true };
}

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  "video/x-m4v",
];
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export async function uploadVideo(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé" };

  const file = formData.get("file") as File;
  const bucket = formData.get("bucket") as string;

  if (!file) {
    return { error: "Aucun fichier fourni" };
  }

  // Check MIME type or file extension
  const fileName = file.name.toLowerCase();
  const isMov = fileName.endsWith(".mov");
  const isMp4 = fileName.endsWith(".mp4");
  const isWebm = fileName.endsWith(".webm");
  const isValidType = ALLOWED_VIDEO_TYPES.includes(file.type) || isMov || isMp4 || isWebm;

  if (!isValidType) {
    return {
      error: `Type de fichier non supporté. Formats acceptés: MP4, MOV, WebM`,
    };
  }

  if (file.size > MAX_VIDEO_SIZE) {
    return { error: "Fichier trop volumineux (max 100 MB)" };
  }

  // Map bucket names to Cloudinary folders
  const folderMap: Record<string, "products" | "categories" | "store" | "featured" | "lots"> = {
    products: "products",
    categories: "categories",
    store: "store",
    featured: "featured",
    lots: "lots",
  };

  const folder = folderMap[bucket];
  if (!folder) {
    return { error: "Bucket invalide" };
  }

  // Upload to Cloudinary
  const result = await cloudinaryUploadVideo(file, folder);

  if (!result.success || !result.url) {
    return { error: result.error || "Erreur lors de l'upload vidéo" };
  }

  return { url: result.url };
}

// Upload multiple images at once
export async function uploadImages(
  formData: FormData
): Promise<{ urls: string[]; errors: string[] }> {
  const admin = await requireAdmin();
  if (!admin) return { urls: [], errors: ["Non autorisé"] };

  const files = formData.getAll("files") as File[];
  const bucket = formData.get("bucket") as string;

  const urls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const singleFormData = new FormData();
    singleFormData.set("file", file);
    singleFormData.set("bucket", bucket);

    const result = await uploadImage(singleFormData);

    if (result.url) {
      urls.push(result.url);
    } else if (result.error) {
      errors.push(`${file.name}: ${result.error}`);
    }
  }

  return { urls, errors };
}
