import { z } from "zod";
import { UPLOAD_FOLDERS } from "./constants";

const folders = Object.values(UPLOAD_FOLDERS) as [string, ...string[]];

export const uploadSignatureSchema = z.object({
  folder: z.enum(folders),
  resourceType: z.enum(["image", "video"]).default("image"),
});
