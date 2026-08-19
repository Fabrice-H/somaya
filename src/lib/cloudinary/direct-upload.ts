/**
 * Direct Cloudinary upload (client-side only)
 * This file should NEVER import from the cloudinary package (server-only)
 */

export interface DirectUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

interface SignatureResponse {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
}

/**
 * Get upload signature from server
 */
async function getUploadSignature(folder: string): Promise<SignatureResponse> {
  const response = await fetch("/api/upload/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get upload signature");
  }

  return response.json();
}

/**
 * Upload image directly to Cloudinary (bypasses Vercel limits)
 * Uses unsigned upload with server-generated signature
 */
export async function uploadToCloudinaryDirect(
  file: File,
  folder: string = "somaya/products"
): Promise<DirectUploadResult> {
  try {
    // Get signed upload parameters from server
    const { signature, timestamp, folder: signedFolder, apiKey, cloudName } =
      await getUploadSignature(folder);

    // Create form data for Cloudinary upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", apiKey);
    formData.append("folder", signedFolder);

    // Upload directly to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary upload error:", errorData);
      return {
        success: false,
        error: errorData.error?.message || "Upload failed",
      };
    }

    const result = await response.json();

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Direct upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload multiple images directly to Cloudinary
 */
export async function uploadMultipleToCloudinaryDirect(
  files: File[],
  folder: string = "somaya/products",
  onProgress?: (completed: number, total: number) => void
): Promise<DirectUploadResult[]> {
  const results: DirectUploadResult[] = [];
  const total = files.length;

  // Process with concurrency limit of 3
  const concurrencyLimit = 3;

  for (let i = 0; i < files.length; i += concurrencyLimit) {
    const batch = files.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(
      batch.map((file) => uploadToCloudinaryDirect(file, folder))
    );
    results.push(...batchResults);
    onProgress?.(Math.min(i + concurrencyLimit, total), total);
  }

  return results;
}
