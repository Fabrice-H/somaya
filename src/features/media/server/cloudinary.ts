import { v2 as cloudinary } from "cloudinary";

// Lazy configuration function to ensure env vars are loaded
function getConfiguredCloudinary() {
  const config = cloudinary.config();

  // Only configure if not already configured
  if (!config.cloud_name) {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  return cloudinary;
}

// Export the configured instance getter
export { cloudinary, getConfiguredCloudinary };

// Folder structure for organization
export const CLOUDINARY_FOLDERS = {
  products: "somaya/products",
  categories: "somaya/categories",
  store: "somaya/store",
  featured: "somaya/featured",
  lots: "somaya/lots",
} as const;

// Image transformation presets
export const IMAGE_PRESETS = {
  // Product thumbnails (for listings)
  thumbnail: {
    width: 400,
    height: 500,
    crop: "fill" as const,
    quality: "auto" as const,
    format: "auto" as const,
  },
  // Product detail images
  detail: {
    width: 800,
    height: 1000,
    crop: "fill" as const,
    quality: "auto:best" as const,
    format: "auto" as const,
  },
  // Category banners
  categoryBanner: {
    width: 600,
    height: 400,
    crop: "fill" as const,
    quality: "auto" as const,
    format: "auto" as const,
  },
  // Admin preview
  adminPreview: {
    width: 200,
    height: 250,
    crop: "fill" as const,
    quality: "auto" as const,
    format: "auto" as const,
  },
} as const;
