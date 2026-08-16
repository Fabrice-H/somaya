import { db, products, categories, productLots, priceLots } from "@/lib/db";
import { eq, asc, and, desc } from "drizzle-orm";

// ============================================================
// Types
// ============================================================

export type LotItem = {
  id: string;
  image: string;
  stock: number;
  label?: string;
};

export type LotData = {
  id: string;
  name: string;
  price: number;
  items: LotItem[];
  // Legacy (for backward compat)
  images: string[];
  stock: number;
  isAvailable: boolean;
};

export type LotProduct = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  lots: LotData[];
};

export type PriceGroup = {
  price: number;
  label: string;
  products: LotProduct[];
  totalItems: number;
};

// Category-based grouping types
export type PriceTier = {
  price: number;
  label: string;
  items: Array<{
    item: LotItem;
    lot: LotData;
    product: LotProduct;
  }>;
};

export type CategoryGroup = {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  priceTiers: PriceTier[];
  totalItems: number;
};

// ============================================================
// Helper: Format price for display
// ============================================================

function formatPriceLabel(price: number): string {
  if (price >= 1000) {
    const k = price / 1000;
    // Check if it's a whole number
    if (k === Math.floor(k)) {
      return `${k}k FCFA`;
    }
    return `${k.toFixed(1)}k FCFA`;
  }
  return `${price} FCFA`;
}

// Helper to convert legacy images to items
function getItemsFromLot(lot: {
  id: string;
  items: unknown;
  images: string[] | null;
  stock: number;
}): LotItem[] {
  const items = lot.items as LotItem[] | null;
  if (items && items.length > 0) {
    return items;
  }
  // Legacy migration
  const images = lot.images || [];
  if (images.length > 0) {
    const stockPerItem = Math.floor(lot.stock / images.length);
    return images.map((image, idx) => ({
      id: `legacy-${lot.id}-${idx}`,
      image,
      stock: stockPerItem,
    }));
  }
  return [];
}

// ============================================================
// Query: Get products grouped by actual lot prices
// ============================================================

export async function getProductsWithLots(): Promise<PriceGroup[]> {
  // Fetch all active products with their lots
  const result = await db.query.products.findMany({
    where: eq(products.isActive, true),
    with: {
      category: true,
      lots: {
        where: eq(productLots.isAvailable, true),
        orderBy: [asc(productLots.price)],
      },
    },
    orderBy: [asc(products.name)],
  });

  // Transform to LotProduct format
  const lotProducts: LotProduct[] = result
    .filter((p) => p.lots && p.lots.length > 0)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      images: p.images || [],
      category: p.category
        ? {
            id: p.category.id,
            name: p.category.name,
            slug: p.category.slug,
          }
        : null,
      lots: p.lots.map((lot) => {
        const items = getItemsFromLot(lot);
        return {
          id: lot.id,
          name: lot.name,
          price: Number(lot.price),
          items,
          images: lot.images || [],
          stock: lot.stock,
          isAvailable: lot.isAvailable,
        };
      }),
    }));

  // Collect all unique lot prices
  const uniquePrices = new Set<number>();
  for (const product of lotProducts) {
    for (const lot of product.lots) {
      uniquePrices.add(lot.price);
    }
  }

  // Sort prices ascending
  const sortedPrices = Array.from(uniquePrices).sort((a, b) => a - b);

  // Create price groups based on actual prices
  const priceGroups: PriceGroup[] = sortedPrices.map((price) => ({
    price,
    label: formatPriceLabel(price),
    products: [],
    totalItems: 0,
  }));

  // Assign products to price groups
  for (const product of lotProducts) {
    for (const lot of product.lots) {
      const group = priceGroups.find((g) => g.price === lot.price);
      if (group) {
        // Check if product is already in this group
        const existingProduct = group.products.find((p) => p.id === product.id);
        if (!existingProduct) {
          // Add product with only the lots at this exact price
          const lotsAtPrice = product.lots.filter((l) => l.price === lot.price);
          group.products.push({
            ...product,
            lots: lotsAtPrice,
          });
          // Count total items
          group.totalItems += lotsAtPrice.reduce((sum, l) => sum + l.items.length, 0);
        }
      }
    }
  }

  // Filter out empty groups and return
  return priceGroups.filter((group) => group.products.length > 0);
}

// ============================================================
// Query: Get products grouped by category then by price
// ============================================================

export async function getProductsByCategory(): Promise<CategoryGroup[]> {
  // Fetch all active products with their lots
  const result = await db.query.products.findMany({
    where: eq(products.isActive, true),
    with: {
      category: true,
      lots: {
        where: eq(productLots.isAvailable, true),
        orderBy: [asc(productLots.price)],
      },
    },
    orderBy: [asc(products.name)],
  });

  // Transform to LotProduct format
  const lotProducts: LotProduct[] = result
    .filter((p) => p.lots && p.lots.length > 0 && p.category)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      images: p.images || [],
      category: p.category
        ? {
            id: p.category.id,
            name: p.category.name,
            slug: p.category.slug,
          }
        : null,
      lots: p.lots.map((lot) => {
        const items = getItemsFromLot(lot);
        return {
          id: lot.id,
          name: lot.name,
          price: Number(lot.price),
          items,
          images: lot.images || [],
          stock: lot.stock,
          isAvailable: lot.isAvailable,
        };
      }),
    }));

  // Group by category
  const categoryMap = new Map<string, { category: CategoryGroup["category"]; products: LotProduct[] }>();

  for (const product of lotProducts) {
    if (!product.category) continue;

    const key = product.category.id;
    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        category: product.category,
        products: [],
      });
    }
    categoryMap.get(key)!.products.push(product);
  }

  // Transform to CategoryGroup with price tiers
  const categoryGroups: CategoryGroup[] = [];

  for (const { category, products: catProducts } of categoryMap.values()) {
    // Collect all items by price
    const priceMap = new Map<number, PriceTier["items"]>();

    for (const product of catProducts) {
      for (const lot of product.lots) {
        if (!priceMap.has(lot.price)) {
          priceMap.set(lot.price, []);
        }
        for (const item of lot.items) {
          priceMap.get(lot.price)!.push({ item, lot, product });
        }
      }
    }

    // Sort prices and create tiers
    const sortedPrices = Array.from(priceMap.keys()).sort((a, b) => a - b);
    const priceTiers: PriceTier[] = sortedPrices.map((price) => ({
      price,
      label: formatPriceLabel(price),
      items: priceMap.get(price)!,
    }));

    const totalItems = priceTiers.reduce((sum, tier) => sum + tier.items.length, 0);

    if (totalItems > 0) {
      categoryGroups.push({
        category,
        priceTiers,
        totalItems,
      });
    }
  }

  // Sort categories by name
  categoryGroups.sort((a, b) => a.category.name.localeCompare(b.category.name));

  return categoryGroups;
}

// ============================================================
// Query: Get all products with their lots (for filter page)
// ============================================================

export type ProductWithLots = {
  id: string;
  name: string;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  lots: Array<{
    id: string;
    name: string;
    price: number;
    items: LotItem[];
  }>;
  totalItems: number;
  minPrice: number;
  maxPrice: number;
};

export async function getAllProductsWithLots(): Promise<{
  products: ProductWithLots[];
  availablePrices: number[];
  categories: Array<{ id: string; name: string; slug: string }>;
}> {
  // Fetch all active products with their lots
  const result = await db.query.products.findMany({
    where: eq(products.isActive, true),
    with: {
      category: true,
      lots: {
        where: eq(productLots.isAvailable, true),
        orderBy: [asc(productLots.price)],
      },
    },
    orderBy: [asc(products.name)],
  });

  // Transform and filter products with lots
  const productsWithLots: ProductWithLots[] = result
    .filter((p) => p.lots && p.lots.length > 0)
    .map((p) => {
      const lots = p.lots.map((lot) => {
        const items = getItemsFromLot(lot);
        return {
          id: lot.id,
          name: lot.name,
          price: Number(lot.price),
          items,
        };
      });

      const prices = lots.map((l) => l.price);
      const totalItems = lots.reduce((sum, l) => sum + l.items.length, 0);

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category
          ? {
              id: p.category.id,
              name: p.category.name,
              slug: p.category.slug,
            }
          : null,
        lots,
        totalItems,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
      };
    });

  // Collect unique prices
  const priceSet = new Set<number>();
  for (const product of productsWithLots) {
    for (const lot of product.lots) {
      priceSet.add(lot.price);
    }
  }
  const availablePrices = Array.from(priceSet).sort((a, b) => a - b);

  // Collect unique categories
  const categoryMap = new Map<string, { id: string; name: string; slug: string }>();
  for (const product of productsWithLots) {
    if (product.category) {
      categoryMap.set(product.category.id, product.category);
    }
  }
  const categories = Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return { products: productsWithLots, availablePrices, categories };
}

// ============================================================
// Query: Get available price points for filters
// ============================================================

export async function getAvailablePriceLots(): Promise<{ price: number; label: string; count: number }[]> {
  const result = await db.query.productLots.findMany({
    where: eq(productLots.isAvailable, true),
    columns: {
      price: true,
    },
  });

  // Count products per price
  const priceCounts = new Map<number, number>();
  for (const lot of result) {
    const price = Number(lot.price);
    priceCounts.set(price, (priceCounts.get(price) || 0) + 1);
  }

  // Sort by price and format
  return Array.from(priceCounts.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([price, count]) => ({
      price,
      label: formatPriceLabel(price),
      count,
    }));
}

// ============================================================
// NEW: Price Lots (independent price groups)
// ============================================================

export type PriceLotItemPublic = {
  id: string;
  image: string;
  stock: number;
  label?: string;
};

export type PriceLotPublic = {
  id: string;
  name: string;
  price: number;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  items: PriceLotItemPublic[];
  totalItems: number;
  totalStock: number;
};

// Get all active price lots for client page
export async function getActivePriceLots(): Promise<{
  lots: PriceLotPublic[];
  availablePrices: number[];
  categories: Array<{ id: string; name: string; slug: string }>;
}> {
  const result = await db.query.priceLots.findMany({
    where: eq(priceLots.isActive, true),
    with: {
      category: true,
    },
    orderBy: [asc(priceLots.sortOrder), asc(priceLots.price)],
  });

  const lots: PriceLotPublic[] = result.map((lot) => {
    const items = (lot.items as PriceLotItemPublic[]) || [];
    return {
      id: lot.id,
      name: lot.name,
      price: Number(lot.price),
      category: lot.category
        ? { id: lot.category.id, name: lot.category.name, slug: lot.category.slug }
        : null,
      items,
      totalItems: items.length,
      totalStock: items.reduce((sum, item) => sum + item.stock, 0),
    };
  });

  // Collect unique prices
  const priceSet = new Set<number>();
  for (const lot of lots) {
    priceSet.add(lot.price);
  }
  const availablePrices = Array.from(priceSet).sort((a, b) => a - b);

  // Collect unique categories
  const categoryMap = new Map<string, { id: string; name: string; slug: string }>();
  for (const lot of lots) {
    if (lot.category) {
      categoryMap.set(lot.category.id, lot.category);
    }
  }
  const categories = Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return { lots, availablePrices, categories };
}
