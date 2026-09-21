import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/features/products/components/detail/ProductDetail";
import { RelatedProducts } from "@/features/products/components/RelatedProducts";
import { buildProductJsonLd, buildProductMetadata } from "@/features/products/seo";
import {
  getActiveProductSlugs,
  getProductDetail,
  getRelatedProducts,
} from "@/features/products/server/queries";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    return await getActiveProductSlugs();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetail(slug);
  return product ? buildProductMetadata(product) : { title: "Produit introuvable | SO'MAYA" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductDetail(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(product)) }}
      />
      <ProductDetail product={product} />
      <RelatedProducts products={relatedProducts} />
    </>
  );
}
