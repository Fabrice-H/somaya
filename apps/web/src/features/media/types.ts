import type { UPLOAD_FOLDERS } from "./constants";

export type UploadBucket = keyof typeof UPLOAD_FOLDERS;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[UploadBucket];

export type UploadResourceType = "image" | "video";

export type DirectUploadResult = {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
};

export type SignedUpload = {
  uploadUrl: string;
  params: Record<string, string>;
};

export type DeleteResult = {
  success: boolean;
  error?: string;
};
