import { Suspense } from "react";
import type { Metadata } from "next";
import { getCategories } from "@/features/categories/server/queries";
import { getAdminProducts } from "@/features/products/server/queries";
import { ProductsClient } from "@/features/products/components/admin/ProductsClient";
import { ProductsSkeleton } from "@/features/products/components/admin/list/ProductsSkeleton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Produits | Admin SO'MAYA",
};

async function ProductsData() {
  const [products, categories] = await Promise.all([getAdminProducts(), getCategories()]);
  return <ProductsClient products={products} categories={categories} />;
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsData />
    </Suspense>
  );
}
