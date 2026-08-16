"use server";

import { getConfiguredCloudinary, CLOUDINARY_FOLDERS } from "./config";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export type UploadResult = {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
};

export type DeleteResult = {
  success: boolean;
  error?: string;
};

/**
 * Upload a single image to Cloudinary
 */
export async function uploadImage(
  file: File,
  folder: keyof typeof CLOUDINARY_FOLDERS = "products"
): Promise<UploadResult> {
  try {
    // Verify Cloudinary configuration
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary config missing:", {
        hasCloudName: !!cloudName,
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
      });
      return {
        success: false,
        error: "Configuration Cloudinary manquante",
      };
    }

    // Convert File to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const cloudinary = getConfiguredCloudinary();
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload(
        base64,
        {
          folder: CLOUDINARY_FOLDERS[folder],
          resource_type: "image",
          transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload rejected:", error);
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error("No result from Cloudinary"));
          }
        }
      );
    });

    if (result.secure_url) {
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    console.error("Cloudinary result missing secure_url:", result);
    return { success: false, error: "Upload incomplet" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Cloudinary upload error:", errorMessage, error);
    return {
      success: false,
      error: `Erreur Cloudinary: ${errorMessage}`,
    };
  }
}

/**
 * Upload multiple images to Cloudinary
 */
export async function uploadImages(
  files: File[],
  folder: keyof typeof CLOUDINARY_FOLDERS = "products"
): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map((file) => uploadImage(file, folder))
  );
  return results;
}

/**
 * Upload a video to Cloudinary
 */
export async function uploadVideo(
  file: File,
  folder: keyof typeof CLOUDINARY_FOLDERS = "store"
): Promise<UploadResult> {
  try {
    // Verify Cloudinary configuration
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary config missing");
      return {
        success: false,
        error: "Configuration Cloudinary manquante",
      };
    }

    // Convert File to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary as video
    const cloudinary = getConfiguredCloudinary();
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload(
        base64,
        {
          folder: CLOUDINARY_FOLDERS[folder],
          resource_type: "video",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary video upload rejected:", error);
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error("No result from Cloudinary"));
          }
        }
      );
    });

    if (result.secure_url) {
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    console.error("Cloudinary result missing secure_url:", result);
    return { success: false, error: "Upload vidéo incomplet" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Cloudinary video upload error:", errorMessage, error);
    return {
      success: false,
      error: `Erreur Cloudinary: ${errorMessage}`,
    };
  }
}

/**
 * Delete an image from Cloudinary by public ID
 */
export async function deleteImage(publicId: string): Promise<DeleteResult> {
  try {
    const cloudinary = getConfiguredCloudinary();
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

/**
 * Delete multiple images from Cloudinary
 */
export async function deleteImages(publicIds: string[]): Promise<DeleteResult> {
  try {
    const cloudinary = getConfiguredCloudinary();
    await cloudinary.api.delete_resources(publicIds);
    return { success: true };
  } catch (error) {
    console.error("Cloudinary bulk delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}
