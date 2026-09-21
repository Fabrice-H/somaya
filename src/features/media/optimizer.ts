import imageCompression from "browser-image-compression";
import { IMAGE_CONFIG } from "./constants";

export async function compressImage(file: File): Promise<File> {
  if (file.size < IMAGE_CONFIG.compressionThreshold) return file;
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: IMAGE_CONFIG.maxSizeMB,
      maxWidthOrHeight: IMAGE_CONFIG.maxWidthOrHeight,
      initialQuality: IMAGE_CONFIG.quality,
      useWebWorker: true,
      preserveExif: false,
    });
    return new File([compressed], file.name, { type: compressed.type });
  } catch {
    return file;
  }
}
