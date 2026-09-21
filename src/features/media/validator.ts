import { IMAGE_CONFIG } from "./constants";

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

export function validateImageFile(file: File): ValidationResult {
  const fileName = file.name.toLowerCase();
  const isHeic = fileName.endsWith(".heic") || fileName.endsWith(".heif");
  const validType =
    (IMAGE_CONFIG.acceptedTypes as readonly string[]).includes(file.type) ||
    isHeic;

  if (!validType) {
    const supportedFormats = IMAGE_CONFIG.acceptedExtensions.join(", ");
    return {
      valid: false,
      error: `Type de fichier non supporté. Formats acceptés: ${supportedFormats}`,
    };
  }

  if (file.size > IMAGE_CONFIG.maxFileSizeBeforeCompression) {
    const maxSizeMB = IMAGE_CONFIG.maxFileSizeBeforeCompression / 1024 / 1024;
    return {
      valid: false,
      error: `Fichier trop volumineux (max ${maxSizeMB} MB avant compression)`,
    };
  }

  return { valid: true };
}

export function validateImageCount(
  currentCount: number,
  newCount: number,
  maxImages: number = IMAGE_CONFIG.maxImages
): ValidationResult {
  const total = currentCount + newCount;
  if (total > maxImages) {
    return {
      valid: false,
      error: `Maximum ${maxImages} images autorisées. Vous en avez déjà ${currentCount}.`,
    };
  }
  return { valid: true };
}
