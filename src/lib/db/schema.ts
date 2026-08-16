import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// ENUMS
// ============================================================

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "mobile_money",
  "bank_transfer",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "refunded",
]);

// ============================================================
// TABLES
// ============================================================

// Admin Users
export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    isActive: boolean("is_active").default(true).notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_admin_users_email").on(table.email)]
);

// Categories
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    imageUrl: varchar("image_url", { length: 500 }),
    position: integer("position").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_categories_position").on(table.position)]
);

// Products
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    oldPrice: decimal("old_price", { precision: 10, scale: 2 }),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    images: jsonb("images").$type<string[]>().default([]),
    colors: jsonb("colors").$type<string[]>().default([]),
    sizes: jsonb("sizes").$type<string[]>().default([]),
    material: varchar("material", { length: 255 }),
    stock: integer("stock").default(0).notNull(),
    lowStockThreshold: integer("low_stock_threshold").default(5).notNull(),
    sku: varchar("sku", { length: 100 }),
    isActive: boolean("is_active").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isNew: boolean("is_new").default(false).notNull(),
    isBestseller: boolean("is_bestseller").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    viewsCount: integer("views_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_products_category").on(table.categoryId),
    index("idx_products_is_active").on(table.isActive),
    index("idx_products_slug").on(table.slug),
    index("idx_products_featured").on(table.isFeatured),
    index("idx_products_created").on(table.createdAt),
  ]
);

// Lot Item type (each item in a lot is a purchasable article)
export type LotItem = {
  id: string;
  image: string;
  stock: number;
  label?: string; // Optional label like "Chaussure rouge"
};

// Product Lots (price groups with multiple items)
export const productLots = pgTable(
  "product_lots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    // NEW: items array - each item has its own image and stock
    items: jsonb("items").$type<LotItem[]>().default([]),
    // DEPRECATED: kept for backward compatibility, use items instead
    images: jsonb("images").$type<string[]>().default([]),
    stock: integer("stock").default(0).notNull(),
    isAvailable: boolean("is_available").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_product_lots_product").on(table.productId),
    index("idx_product_lots_available").on(table.isAvailable),
  ]
);

// Delivery Zones
export const deliveryZones = pgTable("delivery_zones", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  fee: decimal("fee", { precision: 10, scale: 2 }).default("0").notNull(),
  estimatedDays: varchar("estimated_days", { length: 50 }),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Orders
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
    customerFirstName: varchar("customer_first_name", { length: 255 }).notNull(),
    customerLastName: varchar("customer_last_name", { length: 255 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
    customerEmail: varchar("customer_email", { length: 255 }),
    customerAddress: text("customer_address").notNull(),
    customerCommune: varchar("customer_commune", { length: 255 }),
    customerNotes: text("customer_notes"),
    status: orderStatusEnum("status").default("pending").notNull(),
    paymentMethod: paymentMethodEnum("payment_method").default("cash").notNull(),
    paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("0").notNull(),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    deliveryZoneId: uuid("delivery_zone_id").references(() => deliveryZones.id, { onDelete: "set null" }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_orders_status").on(table.status),
    index("idx_orders_created_at").on(table.createdAt),
    index("idx_orders_order_number").on(table.orderNumber),
  ]
);

// Order Items
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    productName: varchar("product_name", { length: 255 }).notNull(),
    productPrice: decimal("product_price", { precision: 10, scale: 2 }).notNull(),
    productImage: varchar("product_image", { length: 500 }),
    quantity: integer("quantity").default(1).notNull(),
    color: varchar("color", { length: 100 }),
    size: varchar("size", { length: 50 }),
    lotId: uuid("lot_id").references(() => productLots.id, { onDelete: "set null" }),
    lotName: varchar("lot_name", { length: 100 }),
    lineTotal: decimal("line_total", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_order_items_order_id").on(table.orderId)]
);

// Store Settings (singleton)
export const storeSettings = pgTable("store_settings", {
  id: uuid("id").primaryKey().default("00000000-0000-0000-0000-000000000001"),
  storeName: varchar("store_name", { length: 255 }).default("SO'MAYA").notNull(),
  tagline: varchar("tagline", { length: 500 }),
  logoUrl: varchar("logo_url", { length: 500 }),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  instagramHandle: varchar("instagram_handle", { length: 100 }),
  facebookUrl: varchar("facebook_url", { length: 500 }),
  tiktokHandle: varchar("tiktok_handle", { length: 100 }),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("2000"),
  deliveryHours: varchar("delivery_hours", { length: 255 }),
  primaryColor: varchar("primary_color", { length: 50 }).default("#511F29"),
  secondaryColor: varchar("secondary_color", { length: 50 }).default("#fcd3b4"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Featured Collection (for home page section)
export const featuredCollection = pgTable("featured_collection", {
  id: uuid("id").primaryKey().default("00000000-0000-0000-0000-000000000002"),
  eyebrow: varchar("eyebrow", { length: 100 }).default("La nouvelle saison"),
  title: varchar("title", { length: 255 }).default("Collection Cérémonie 2026"),
  description: text("description"),
  stat1Value: varchar("stat1_value", { length: 50 }),
  stat1Label: varchar("stat1_label", { length: 100 }),
  stat2Value: varchar("stat2_value", { length: 50 }),
  stat2Label: varchar("stat2_label", { length: 100 }),
  buttonText: varchar("button_text", { length: 100 }).default("Voir la collection"),
  buttonLink: varchar("button_link", { length: 255 }).default("/catalogue"),
  images: jsonb("images").$type<string[]>().default([]),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Activity Logs
export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    action: varchar("action", { length: 255 }).notNull(),
    actorEmail: varchar("actor_email", { length: 255 }),
    actorName: varchar("actor_name", { length: 255 }),
    details: jsonb("details"),
    ipAddress: varchar("ip_address", { length: 50 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_activity_logs_created").on(table.createdAt)]
);

// Testimonials
export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    location: varchar("location", { length: 255 }),
    image: varchar("image", { length: 500 }),
    text: text("text").notNull(),
    rating: integer("rating").default(5).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_testimonials_sort").on(table.sortOrder)]
);

// Instagram Posts (for home page section)
export const instagramPosts = pgTable(
  "instagram_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    image: varchar("image", { length: 500 }).notNull(),
    postUrl: varchar("post_url", { length: 500 }),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_instagram_posts_sort").on(table.sortOrder)]
);

// ============================================================
// PRICE LOTS (Independent price groups with items)
// ============================================================

// Price Lot Item type (each item is a purchasable article)
export type PriceLotItem = {
  id: string;
  image: string;
  stock: number;
  label?: string; // Optional label like "Chaîne dorée"
};

// Price Lots (independent price groups - not linked to products)
export const priceLots = pgTable(
  "price_lots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(), // "Chaînes 10k", "Bracelets 8k"
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    items: jsonb("items").$type<PriceLotItem[]>().default([]),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_price_lots_category").on(table.categoryId),
    index("idx_price_lots_price").on(table.price),
    index("idx_price_lots_active").on(table.isActive),
  ]
);

// About Page Collections (for "Nos Collections" section on about page)
export const aboutCollections = pgTable(
  "about_collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    year: varchar("year", { length: 10 }).notNull(),
    backgroundColor: varchar("background_color", { length: 50 }).default("#511F29"),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_about_collections_sort").on(table.sortOrder)]
);

// Hero Banner Settings (singleton for home page hero)
// Layout options: "split" (text left, media right), "centered" (text centered over media), "fullwidth" (full media with overlay)
export const heroBanner = pgTable("hero_banner", {
  id: uuid("id").primaryKey().default("00000000-0000-0000-0000-000000000003"),
  layout: varchar("layout", { length: 50 }).default("split").notNull(), // split, centered, fullwidth
  eyebrow: varchar("eyebrow", { length: 100 }).default("Maison de mode · Abidjan"),
  title: varchar("title", { length: 255 }).default("L'élégance"),
  titleHighlight: varchar("title_highlight", { length: 100 }).default("commence"),
  titleSuffix: varchar("title_suffix", { length: 100 }).default("ici."),
  description: text("description").default("Des pièces sélectionnées pour accompagner chaque femme et chaque homme au quotidien."),
  buttonText: varchar("button_text", { length: 100 }).default("Découvrir la collection"),
  buttonLink: varchar("button_link", { length: 255 }).default("#collections"),
  mediaType: varchar("media_type", { length: 20 }).default("video").notNull(), // image, video
  mediaUrl: varchar("media_url", { length: 500 }).default("/ca34b0bbe4d6416f8820cdb2c9267efc.MOV"),
  mediaPosition: varchar("media_position", { length: 50 }).default("center 22%"),
  backgroundColor: varchar("background_color", { length: 50 }).default("#511F29"),
  textColor: varchar("text_color", { length: 50 }).default("#fbf3ec"),
  accentColor: varchar("accent_color", { length: 50 }).default("#fcd3b4"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================
// RELATIONS
// ============================================================

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  lots: many(productLots),
}));

export const productLotsRelations = relations(productLots, ({ one }) => ({
  product: one(products, {
    fields: [productLots.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  deliveryZone: one(deliveryZones, {
    fields: [orders.deliveryZoneId],
    references: [deliveryZones.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  lot: one(productLots, {
    fields: [orderItems.lotId],
    references: [productLots.id],
  }),
}));

export const priceLotsRelations = relations(priceLots, ({ one }) => ({
  category: one(categories, {
    fields: [priceLots.categoryId],
    references: [categories.id],
  }),
}));

// ============================================================
// TYPES
// ============================================================

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductLot = typeof productLots.$inferSelect;
export type NewProductLot = typeof productLots.$inferInsert;

export type DeliveryZone = typeof deliveryZones.$inferSelect;
export type NewDeliveryZone = typeof deliveryZones.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type StoreSettings = typeof storeSettings.$inferSelect;
export type NewStoreSettings = typeof storeSettings.$inferInsert;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

export type FeaturedCollection = typeof featuredCollection.$inferSelect;
export type NewFeaturedCollection = typeof featuredCollection.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export type InstagramPost = typeof instagramPosts.$inferSelect;
export type NewInstagramPost = typeof instagramPosts.$inferInsert;

export type HeroBanner = typeof heroBanner.$inferSelect;
export type NewHeroBanner = typeof heroBanner.$inferInsert;

export type PriceLot = typeof priceLots.$inferSelect;
export type NewPriceLot = typeof priceLots.$inferInsert;

export type AboutCollection = typeof aboutCollections.$inferSelect;
export type NewAboutCollection = typeof aboutCollections.$inferInsert;

// Helper types
export type ProductWithCategory = Product & { category: Category | null };
export type ProductWithCategoryAndLots = Product & { category: Category | null; lots: ProductLot[] };
export type OrderWithItems = Order & { items: OrderItem[]; deliveryZone: DeliveryZone | null };
