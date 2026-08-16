// Server-side exports
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
