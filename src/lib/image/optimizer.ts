import imageCompression from "browser-image-compression";
import { heicTo } from "heic-to";
import { IMAGE_CONFIG } from "./constants";

export type OptimizationResult = {
  file: File;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
};

function isHeicFile(file: File): boolean {
  const fileName = file.name.toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif")
  );
}

async function convertHeicToJpeg(file: File): Promise<File> {
  const blob = await heicTo({
    blob: file,
    type: "image/jpeg",
    quality: 0.9,
  });

  const newFileName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
  return new File([blob], newFileName, { type: "image/jpeg" });
}

export async function optimizeImage(file: File): Promise<OptimizationResult> {
  const originalSize = file.size;
  let processedFile = file;

  // Convert HEIC/HEIF to JPEG first
  if (isHeicFile(file)) {
    processedFile = await convertHeicToJpeg(file);
  }

  // Compress and convert to WebP
  const compressed = await imageCompression(processedFile, {
    maxSizeMB: IMAGE_CONFIG.maxSizeMB,
    maxWidthOrHeight: IMAGE_CONFIG.maxWidthOrHeight,
    useWebWorker: true,
    fileType: IMAGE_CONFIG.outputType,
    initialQuality: IMAGE_CONFIG.quality,
    preserveExif: false, // Remove metadata for privacy/security
  });

  // Create final file with .webp extension
  const baseName = processedFile.name.replace(/\.[^.]+$/, "");
  const optimizedFile = new File([compressed], `${baseName}.webp`, {
    type: IMAGE_CONFIG.outputType,
  });

  return {
    file: optimizedFile,
    originalSize,
    optimizedSize: optimizedFile.size,
    compressionRatio: originalSize / optimizedFile.size,
  };
}

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
