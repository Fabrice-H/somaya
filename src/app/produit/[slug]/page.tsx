import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ProductDetail } from "./ProductDetail";
import { getProductWithLots, getRelatedProducts } from "@/lib/queries/products";
import { db, products } from "@/lib/db";
import { eq } from "drizzle-orm";

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

// Pre-render all product pages at build time
export async function generateStaticParams() {
  try {
    const allProducts = await db
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.isActive, true));

    return allProducts.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    // If database is not available during build, return empty array
    // Pages will be generated on-demand with ISR
    console.warn("generateStaticParams: Database not available, skipping pre-render", error);
    return [];
  }
}

function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("fr-CI", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(numPrice) + " FCFA";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductWithLots(slug);

  if (!product) {
    return {
      title: "Produit non trouvé | SO'MAYA",
    };
  }

  const price = parseFloat(product.price);
  const categoryName = product.category?.name || "Mode";
  const description = product.description ||
    `Découvrez ${product.name} chez SO'MAYA - ${categoryName} de qualité premium à Abidjan.`;

  return {
    title: `${product.name} | SO'MAYA`,
    description,
    keywords: [product.name, categoryName, "SO'MAYA", "mode", "Abidjan", "Côte d'Ivoire"],
    openGraph: {
      title: `${product.name} - ${formatPrice(price)}`,
      description,
      type: "website",
      locale: "fr_CI",
      siteName: "SO'MAYA",
      images: product.images?.length ? [
        {
          url: product.images[0],
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
    alternates: {
      canonical: `https://somaya.ci/produit/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // Fetch product and related products in parallel
  const product = await getProductWithLots(slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current)
  const relatedProducts = await getRelatedProducts(
    product.id,
    product.categoryId,
    4
  );

  const siteUrl = "https://somaya.ci";
  const productUrl = `${siteUrl}/produit/${product.slug}`;
  const price = parseFloat(product.price);

  // JSON-LD Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    name: product.name,
    description: product.description || `${product.name} - Pièce sélectionnée par SO'MAYA à Abidjan`,
    image: product.images,
    sku: product.sku || product.id,
    material: product.material,
    category: product.category?.name || "Mode",
    brand: {
      "@type": "Brand",
      name: "SO'MAYA",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: price,
      priceCurrency: "XOF",
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "SO'MAYA",
        url: siteUrl,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "CI",
          addressRegion: "Abidjan",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  return (
    <>
      {/* Preload first image for faster display */}
      {product.images?.[0] && (
        <link
          rel="preload"
          as="image"
          href={product.images[0]}
          fetchPriority="high"
        />
      )}

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeaderWrapper />
      <main style={{ paddingTop: "20px" }}>
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
      <CartSidebar />
      <WhatsAppButton />
    </>
  );
}
