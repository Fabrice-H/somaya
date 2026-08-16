import { NextRequest, NextResponse } from "next/server";
import { getProductsByIds, getLotsByIds } from "@/lib/queries/products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, lotIds } = body;

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "productIds array is required" },
        { status: 400 }
      );
    }

    // Fetch products
    const products = await getProductsByIds(productIds);

    // Fetch lots if needed
    let lots: Awaited<ReturnType<typeof getLotsByIds>> = [];
    if (lotIds && Array.isArray(lotIds) && lotIds.length > 0) {
      lots = await getLotsByIds(lotIds);
    }

    return NextResponse.json({ products, lots });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
