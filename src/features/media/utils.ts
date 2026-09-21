import { VIDEO_CONFIG } from "./constants";

const MANAGED_PREFIX = "somaya/";

export function getPublicIdFromUrl(url: string): string | null {
  const match = url.match(/\/v\d+\/(.+)\.\w+$/);
  return match ? match[1] : null;
}

export function isManagedPublicId(publicId: string): boolean {
  return publicId.startsWith(MANAGED_PREFIX);
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/") || VIDEO_CONFIG.extensionPattern.test(file.name);
}
