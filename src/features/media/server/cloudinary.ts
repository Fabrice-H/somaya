import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { serverEnv } from "@/shared/lib/env";
import { IMAGE_CONFIG } from "../constants";
import type { SignedUpload, UploadResourceType } from "../types";

function getCloudinary() {
  if (!cloudinary.config().cloud_name) {
    const env = serverEnv();
    cloudinary.config({
      cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  return cloudinary;
}

export function signUpload(folder: string, resourceType: UploadResourceType): SignedUpload {
  const client = getCloudinary();
  const { cloud_name, api_key, api_secret } = client.config();
  if (!cloud_name || !api_key || !api_secret) throw new Error("Configuration Cloudinary manquante");

  const toSign: Record<string, string> = { timestamp: String(Math.round(Date.now() / 1000)), folder };
  if (resourceType === "image") toSign.format = IMAGE_CONFIG.outputFormat;

  const signature = client.utils.api_sign_request(toSign, api_secret);
  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`,
    params: { ...toSign, signature, api_key },
  };
}

export async function destroyAsset(publicId: string, resourceType: UploadResourceType = "image") {
  await getCloudinary().uploader.destroy(publicId, { resource_type: resourceType });
}
