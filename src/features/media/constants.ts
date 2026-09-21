export const IMAGE_CONFIG = {
  maxSizeMB: 2,
  maxWidthOrHeight: 2000,
  acceptedTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ],
  acceptedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"],
  outputType: "image/webp" as const,
  quality: 0.85,
  maxImages: 5,
  maxFileSizeBeforeCompression: 15 * 1024 * 1024, // 15MB
} as const;

export type ImageOutputType = (typeof IMAGE_CONFIG)["outputType"];
