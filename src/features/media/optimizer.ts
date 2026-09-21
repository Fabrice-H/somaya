import imageCompression from "browser-image-compression";
import { IMAGE_CONFIG } from "./constants";

export type OptimizationResult = {
  file: File;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
};

/**
 * Optimize a single image for upload
 * Note: HEIC files are passed through - Cloudinary handles conversion server-side
 */
export async function optimizeImage(file: File): Promise<OptimizationResult> {
  const originalSize = file.size;

  // Skip optimization for small files or HEIC (Cloudinary handles HEIC)
  const isHeic = file.name.toLowerCase().match(/\.(heic|heif)$/);
  if (file.size < 500 * 1024 || isHeic) {
    return {
      file,
      originalSize,
      optimizedSize: file.size,
      compressionRatio: 1,
    };
  }

  try {
    // Compress image
    const compressed = await imageCompression(file, {
      maxSizeMB: IMAGE_CONFIG.maxSizeMB,
      maxWidthOrHeight: IMAGE_CONFIG.maxWidthOrHeight,
      useWebWorker: true,
      initialQuality: IMAGE_CONFIG.quality,
      preserveExif: false,
    });

    // Create final file
    const optimizedFile = new File([compressed], file.name, {
      type: compressed.type,
    });

    return {
      file: optimizedFile,
      originalSize,
      optimizedSize: optimizedFile.size,
      compressionRatio: originalSize / optimizedFile.size,
    };
  } catch (error) {
    console.warn("Image optimization failed, using original:", error);
    return {
      file,
      originalSize,
      optimizedSize: file.size,
      compressionRatio: 1,
    };
  }
}

/**
 * Optimize multiple images
 */
export async function optimizeImages(
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<OptimizationResult[]> {
  const results: OptimizationResult[] = [];
  const total = files.length;

  // Process with concurrency limit of 3
  const concurrencyLimit = 3;
  for (let i = 0; i < files.length; i += concurrencyLimit) {
    const batch = files.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(batch.map(optimizeImage));
    results.push(...batchResults);
    onProgress?.(Math.min(i + concurrencyLimit, total), total);
  }

  return results;
}
