// Server-side exports (only import in server components or "use server" files)
export { cloudinary, CLOUDINARY_FOLDERS, IMAGE_PRESETS } from "./config";
export {
  uploadImage,
  uploadImages,
  uploadVideo,
  deleteImage,
  deleteImages,
  type UploadResult,
  type DeleteResult,
} from "./actions";

// Utility exports (can be used anywhere)
export { getOptimizedUrl, getPublicIdFromUrl } from "./utils";

// NOTE: For client-side direct upload, import from "@/lib/cloudinary/direct-upload"
// DO NOT export from here to avoid pulling in cloudinary SDK on client
