import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductDetail } from "./ProductDetail";
import { products, formatPrice } from "@/data/products";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Produit non trouvé | SO'MAYA",
    };
  }

  return {
    title: `${product.name} | SO'MAYA - Mode & Accessoires`,
    description: product.description,
    openGraph: {
      title: `${product.name} - ${formatPrice(product.price)}`,
      description: product.description,
      images: product.images,
    },
  };
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main style={{ paddingTop: "20px" }}>
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </>
  );
}
