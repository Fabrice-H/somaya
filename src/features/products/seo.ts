import type { Metadata } from "next";
import { SITE } from "@/shared/config/site";
import { formatPrice } from "@/shared/lib/format";
import type { ProductWithCategoryAndLots } from "@/shared/lib/db/schema";

const productUrl = (slug: string) => `${SITE.url}/produit/${slug}`;

const productDescription = (product: ProductWithCategoryAndLots) =>
  product.description ??
  `Découvrez ${product.name} chez ${SITE.name} - ${product.category?.name ?? "Mode"} de qualité premium à Abidjan.`;

export function buildProductMetadata(product: ProductWithCategoryAndLots): Metadata {
  const description = productDescription(product);
  const image = product.images?.[0];
  return {
    title: `${product.name} | ${SITE.name}`,
    description,
    keywords: [product.name, product.category?.name ?? "Mode", SITE.name, "mode", "Abidjan", "Côte d'Ivoire"],
    openGraph: {
      title: `${product.name} - ${formatPrice(Number(product.price))}`,
      description,
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      images: image ? [{ url: image, width: 800, height: 1000, alt: product.name }] : undefined,
    },
    twitter: { card: "summary_large_image", title: product.name, description, images: image ? [image] : undefined },
    alternates: { canonical: productUrl(product.slug) },
  };
}

export function buildProductJsonLd(product: ProductWithCategoryAndLots) {
  const url = productUrl(product.slug);
  const oneDay = { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" };
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url,
    name: product.name,
    description: product.description ?? `${product.name} - Pièce sélectionnée par ${SITE.name} à Abidjan`,
    image: product.images,
    sku: product.sku ?? product.id,
    material: product.material,
    category: product.category?.name ?? "Mode",
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      url,
      price: Number(product.price),
      priceCurrency: SITE.currency,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE.name, url: SITE.url },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "CI", addressRegion: "Abidjan" },
        deliveryTime: { "@type": "ShippingDeliveryTime", handlingTime: oneDay, transitTime: oneDay },
      },
    },
  };
}
