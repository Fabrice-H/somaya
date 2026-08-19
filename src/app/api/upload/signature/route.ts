"use server";

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/auth/actions";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { folder } = await request.json();

    // Validate folder
    const allowedFolders = ["somaya/products", "somaya/categories", "somaya/store", "somaya/featured", "somaya/lots"];
    const targetFolder = folder && allowedFolders.includes(folder) ? folder : "somaya/products";

    // Generate timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Generate signature for direct upload
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: targetFolder,
        upload_preset: "ml_default", // Default preset, or create a custom one
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      folder: targetFolder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("Signature generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la signature" },
      { status: 500 }
    );
  }
}
