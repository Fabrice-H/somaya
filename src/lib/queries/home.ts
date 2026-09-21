import { unstable_cache } from "next/cache";
import { db, products, categories, productLots, heroBanner, testimonials, priceLots } from "@/lib/db";
import { eq, desc, asc, and } from "drizzle-orm";
import type { Category, StoreSettings, ProductWithCategoryAndLots, HeroBanner, Testimonial } from "@/lib/db/schema";

// ============================================================
// Types for Home Page Data
// ============================================================

export type HomePageProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  /** Product-level stock, used when the product has no lots */
  stock?: number;
  createdAt?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  lots: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
    isAvailable: boolean;
  }[];
};

export type HomePageCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  position: number;
};

export type HomeHeroBanner = {
  id: string;
  layout: string;
  eyebrow: string | null;
  title: string | null;
  title_highlight: string | null;
  title_suffix: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  media_type: string;
  media_url: string | null;
  media_position: string | null;
  background_color: string | null;
  text_color: string | null;
  accent_color: string | null;
  is_active: boolean;
};

export type HomeTestimonial = {
  id: string;
  name: string;
  location: string | null;
  image: string | null;
  text: string;
  rating: number;
};

export type HomePriceLotItem = {
  id: string;
  image: string;
  stock: number;
  label?: string;
};

export type HomePriceLot = {
  id: string;
  name: string;
  price: number;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  items: HomePriceLotItem[];
  totalItems: number;
  totalStock: number;
};

export type HomePageData = {
  storeSettings: StoreSettings | null;
  categories: HomePageCategory[];
  bestsellers: HomePageProduct[];
  featuredProducts: HomePageProduct[];
  newProducts: HomePageProduct[];
  heroBanner: HomeHeroBanner | null;
  testimonials: HomeTestimonial[];
  priceLots: HomePriceLot[];
};

// ============================================================
// Helper to transform DB product to home page format
// ============================================================

export function toHomePageProduct(
  product: ProductWithCategoryAndLots
): HomePageProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
    images: product.images || [],
    isNew: product.isNew,
    isBestseller: product.isBestseller,
    isFeatured: product.isFeatured,
    stock: product.stock,
    createdAt: new Date(product.createdAt).toISOString(),
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : null,
    lots: (product.lots || []).map((lot) => ({
      id: lot.id,
      name: lot.name,
      price: Number(lot.price),
      images: lot.images || [],
      stock: lot.stock,
      isAvailable: lot.isAvailable,
    })),
  };
}

function toHomePageCategory(category: Category): HomePageCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
    position: category.position,
  };
}

// ============================================================
// Cached Data Fetching Functions
// ============================================================

/**
 * Get store settings - cached for 5 minutes
 */
export const getStoreSettings = unstable_cache(
  async (): Promise<StoreSettings | null> => {
    const result = await db.query.storeSettings.findFirst();
    return result || null;
  },
  ["store-settings"],
  { revalidate: 300, tags: ["store-settings"] }
);

/**
 * Get active categories for home page - cached for 2 minutes
 */
export const getHomeCategories = unstable_cache(
  async (limit = 6): Promise<HomePageCategory[]> => {
    const result = await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [asc(categories.position)],
      limit,
    });

    return result.map(toHomePageCategory);
  },
  ["home-categories"],
  { revalidate: 120, tags: ["categories"] }
);

/**
 * Get bestseller products - cached for 2 minutes
 */
export const getBestsellerProducts = unstable_cache(
  async (limit = 4): Promise<HomePageProduct[]> => {
    const result = await db.query.products.findMany({
      where: and(eq(products.isActive, true), eq(products.isBestseller, true)),
      with: {
        category: true,
        lots: {
          where: eq(productLots.isAvailable, true),
          orderBy: [asc(productLots.sortOrder)],
        },
      },
      orderBy: [desc(products.viewsCount), asc(products.sortOrder)],
      limit,
    });

    return result.map(toHomePageProduct);
  },
  ["home-bestsellers"],
  { revalidate: 120, tags: ["products", "bestsellers"] }
);

/**
 * Get featured products - cached for 2 minutes
 */
export const getFeaturedProducts = unstable_cache(
  async (limit = 8): Promise<HomePageProduct[]> => {
    const result = await db.query.products.findMany({
      where: and(eq(products.isActive, true), eq(products.isFeatured, true)),
      with: {
        category: true,
        lots: {
          where: eq(productLots.isAvailable, true),
          orderBy: [asc(productLots.sortOrder)],
        },
      },
      orderBy: [asc(products.sortOrder)],
      limit,
    });

    return result.map(toHomePageProduct);
  },
  ["home-featured"],
  { revalidate: 120, tags: ["products", "featured"] }
);

/**
 * Get new products - cached for 2 minutes
 */
export const getNewProducts = unstable_cache(
  async (limit = 4): Promise<HomePageProduct[]> => {
    const result = await db.query.products.findMany({
      where: and(eq(products.isActive, true), eq(products.isNew, true)),
      with: {
        category: true,
        lots: {
          where: eq(productLots.isAvailable, true),
          orderBy: [asc(productLots.sortOrder)],
        },
      },
      orderBy: [desc(products.createdAt)],
      limit,
    });

    return result.map(toHomePageProduct);
  },
  ["home-new-products"],
  { revalidate: 120, tags: ["products", "new"] }
);

/**
 * "Coups de cœur" - new products first, completed with the latest
 * products so the section always fills its 2 rows - cached for 2 minutes
 */
export const getCoupsDeCoeurProducts = unstable_cache(
  async (limit = 8): Promise<HomePageProduct[]> => {
    const result = await db.query.products.findMany({
      where: eq(products.isActive, true),
      with: {
        category: true,
        lots: {
          where: eq(productLots.isAvailable, true),
          orderBy: [asc(productLots.sortOrder)],
        },
      },
      orderBy: [desc(products.isNew), desc(products.createdAt)],
      limit,
    });

    return result.map(toHomePageProduct);
  },
  ["home-coups-de-coeur"],
  { revalidate: 120, tags: ["products", "new"] }
);

// ============================================================
// Hero Banner - For home page hero section
// ============================================================

const HERO_BANNER_ID = "00000000-0000-0000-0000-000000000003";

function toHomeHeroBanner(data: HeroBanner): HomeHeroBanner {
  return {
    id: data.id,
    layout: data.layout,
    eyebrow: data.eyebrow,
    title: data.title,
    title_highlight: data.titleHighlight,
    title_suffix: data.titleSuffix,
    description: data.description,
    button_text: data.buttonText,
    button_link: data.buttonLink,
    media_type: data.mediaType,
    media_url: data.mediaUrl,
    media_position: data.mediaPosition,
    background_color: data.backgroundColor,
    text_color: data.textColor,
    accent_color: data.accentColor,
    is_active: data.isActive,
  };
}

/**
 * Get hero banner for home page - cached for 2 minutes
 */
export const getHeroBannerData = unstable_cache(
  async (): Promise<HomeHeroBanner | null> => {
    const result = await db.query.heroBanner.findFirst({
      where: eq(heroBanner.id, HERO_BANNER_ID),
    });

    if (!result || !result.isActive) return null;
    return toHomeHeroBanner(result);
  },
  ["home-hero-banner"],
  { revalidate: 120, tags: ["hero-banner"] }
);

// ============================================================
// Testimonials - For home page
// ============================================================

function toHomeTestimonial(data: Testimonial): HomeTestimonial {
  return {
    id: data.id,
    name: data.name,
    location: data.location,
    image: data.image,
    text: data.text,
    rating: data.rating,
  };
}

/**
 * Get active testimonials for home page - cached for 2 minutes
 */
export const getHomeTestimonials = unstable_cache(
  async (limit = 6): Promise<HomeTestimonial[]> => {
    const result = await db.query.testimonials.findMany({
      where: eq(testimonials.isActive, true),
      orderBy: [asc(testimonials.sortOrder)],
      limit,
    });

    return result.map(toHomeTestimonial);
  },
  ["home-testimonials"],
  { revalidate: 120, tags: ["testimonials"] }
);

// ============================================================
// Price Lots - For home page "Par Budget" section
// ============================================================

/**
 * Get price lots for home page - cached for 2 minutes
 * Shows first items from each price lot, limited to 8 lots
 */
export const getHomePriceLots = unstable_cache(
  async (limit = 8): Promise<HomePriceLot[]> => {
    const result = await db.query.priceLots.findMany({
      where: eq(priceLots.isActive, true),
      with: {
        category: true,
      },
      orderBy: [asc(priceLots.sortOrder), asc(priceLots.price)],
      limit,
    });

    return result.map((lot) => {
      const items = (lot.items as HomePriceLotItem[]) || [];
      return {
        id: lot.id,
        name: lot.name,
        price: Number(lot.price),
        category: lot.category
          ? { id: lot.category.id, name: lot.category.name, slug: lot.category.slug }
          : null,
        items: items.slice(0, 4), // Only first 4 items for home page
        totalItems: items.length,
        totalStock: items.reduce((sum, item) => sum + item.stock, 0),
      };
    });
  },
  ["home-price-lots"],
  { revalidate: 120, tags: ["price-lots"] }
);

// ============================================================
// Main Home Page Data Fetcher - Parallel fetch all data
// ============================================================

/**
 * Fetch all home page data in parallel
 * This is the main function to call from the home page
 */
export async function getHomePageData(): Promise<HomePageData> {
  // Fetch all data in parallel for optimal performance
  const [
    storeSettingsData,
    categoriesData,
    bestsellersData,
    featuredData,
    newProductsData,
    heroBannerData,
    testimonialsData,
    priceLotsData,
  ] = await Promise.all([
    getStoreSettings(),
    getHomeCategories(6),
    getBestsellerProducts(4),
    getFeaturedProducts(8),
    getCoupsDeCoeurProducts(8),
    getHeroBannerData(),
    getHomeTestimonials(6),
    getHomePriceLots(8),
  ]);

  return {
    storeSettings: storeSettingsData,
    categories: categoriesData,
    bestsellers: bestsellersData,
    featuredProducts: featuredData,
    newProducts: newProductsData,
    heroBanner: heroBannerData,
    testimonials: testimonialsData,
    priceLots: priceLotsData,
  };
}

// ============================================================
// Navigation Categories - For header menu
// ============================================================

export type NavCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

/**
 * Get categories for navigation menu - cached for 5 minutes
 */
export const getNavCategories = unstable_cache(
  async (): Promise<NavCategory[]> => {
    const result = await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [asc(categories.position)],
      columns: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
      },
    });

    return result;
  },
  ["nav-categories"],
  { revalidate: 300, tags: ["categories"] }
);
