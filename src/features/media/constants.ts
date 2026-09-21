export const UPLOAD_FOLDERS = {
  products: "somaya/products",
  categories: "somaya/categories",
  store: "somaya/store",
  featured: "somaya/featured",
  lots: "somaya/lots",
} as const;

export const IMAGE_CONFIG = {
  acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  acceptedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"],
  maxImages: 5,
  maxFileSizeBeforeCompression: 15 * 1024 * 1024,
  compressionThreshold: 500 * 1024,
  maxSizeMB: 2,
  maxWidthOrHeight: 2400,
  quality: 0.9,
  outputFormat: "webp",
} as const;

export const VIDEO_CONFIG = {
  accept: "video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm",
  extensionPattern: /\.(mp4|mov|webm|m4v|avi)$/i,
  maxFileSize: 100 * 1024 * 1024,
} as const;

export const SIGNATURE_ENDPOINT = "/api/upload/signature";
