import { SIGNATURE_ENDPOINT, UPLOAD_FOLDERS } from "./constants";
import type { DirectUploadResult, SignedUpload, UploadResourceType } from "./types";

async function requestSignedUpload(folder: string, resourceType: UploadResourceType): Promise<SignedUpload> {
  const response = await fetch(SIGNATURE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, resourceType }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Signature refusée");
  return body;
}

async function uploadDirect(file: File, folder: string, resourceType: UploadResourceType): Promise<DirectUploadResult> {
  try {
    const { uploadUrl, params } = await requestSignedUpload(folder, resourceType);
    const formData = new FormData();
    formData.append("file", file);
    for (const [key, value] of Object.entries(params)) formData.append(key, value);

    const response = await fetch(uploadUrl, { method: "POST", body: formData });
    const result = await response.json();
    if (!response.ok) return { success: false, error: result.error?.message || "Échec de l'upload" };
    return { success: true, url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Échec de l'upload" };
  }
}

export function uploadToCloudinaryDirect(file: File, folder: string = UPLOAD_FOLDERS.products) {
  return uploadDirect(file, folder, "image");
}

export function uploadVideoToCloudinaryDirect(file: File, folder: string = UPLOAD_FOLDERS.store) {
  return uploadDirect(file, folder, "video");
}
