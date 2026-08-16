/**
 * Script pour créer des produits de test avec lots de prix
 *
 * Usage:
 *   node scripts/seed-test-products.mjs          # Créer les produits
 *   node scripts/seed-test-products.mjs delete   # Supprimer les produits de test
 */

import { config } from "dotenv";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";

// Load env
config({ path: resolve(process.cwd(), ".env.local") });

const sql = neon(process.env.DATABASE_URL);

// Préfixe pour identifier les produits de test
const TEST_PREFIX = "[TEST]";
const TEST_SKU_PREFIX = "TEST-";

// Images de placeholder (Unsplash)
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
  "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
  "https://images.unsplash.com/photo-1485218126466-34e6392ec754?w=800",
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800",
];

// Données des produits de test
const TEST_PRODUCTS = [
  // Produits Femmes
  { name: "Robe Élégante Soirée", category: "femmes", price: 35000, hasLots: true, isFeatured: true, isNew: true },
  { name: "Ensemble Wax Moderne", category: "femmes", price: 28000, hasLots: true, isBestseller: true },
  { name: "Jupe Longue Traditionnelle", category: "femmes", price: 18000, hasLots: false },
  { name: "Top Dentelle Brodé", category: "femmes", price: 15000, hasLots: false, isNew: true },

  // Produits Hommes
  { name: "Boubou Grand Homme", category: "hommes", price: 45000, hasLots: true, isFeatured: true },
  { name: "Chemise Bazin Brodée", category: "hommes", price: 25000, hasLots: true, isBestseller: true },
  { name: "Ensemble Caftan Luxe", category: "hommes", price: 55000, hasLots: false, isFeatured: true },
  { name: "Pantalon Traditionnel", category: "hommes", price: 20000, hasLots: false },

  // Boubous
  { name: "Boubou Sénégalais Classique", category: "boubous", price: 40000, hasLots: true, isBestseller: true },
  { name: "Grand Boubou Cérémonie", category: "boubous", price: 65000, hasLots: true, isFeatured: true },
  { name: "Boubou Bazin Riche", category: "boubous", price: 50000, hasLots: false, isNew: true },
  { name: "Boubou Simple Quotidien", category: "boubous", price: 30000, hasLots: false },

  // Sacs
  { name: "Sac à Main Cuir Tressé", category: "sacs", price: 22000, hasLots: true, isBestseller: true },
  { name: "Pochette Soirée Dorée", category: "sacs", price: 15000, hasLots: false, isNew: true },
  { name: "Sac Bandoulière Wax", category: "sacs", price: 18000, hasLots: true },
  { name: "Cabas XL Shopping", category: "sacs", price: 25000, hasLots: false },

  // Accessoires
  { name: "Foulard Soie Imprimé", category: "accessoires", price: 12000, hasLots: false, isNew: true },
  { name: "Ceinture Cuir Artisanale", category: "accessoires", price: 8000, hasLots: true },
  { name: "Bracelet Perles Africaines", category: "accessoires", price: 5000, hasLots: false, isBestseller: true },
  { name: "Collier Statement", category: "accessoires", price: 15000, hasLots: true, isFeatured: true },
];

// Lots de prix pour les produits
const LOTS_CONFIG = [
  { name: "Lot Standard", priceMultiplier: 1, stock: 10 },
  { name: "Lot Premium", priceMultiplier: 1.3, stock: 5 },
  { name: "Lot VIP", priceMultiplier: 1.6, stock: 3 },
];

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getRandomImages(count = 3) {
  const shuffled = [...PLACEHOLDER_IMAGES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function getCategories() {
  const result = await sql`SELECT id, slug, name FROM categories WHERE is_active = true`;
  return result.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {});
}

async function createTestProducts() {
  console.log("🚀 Création des produits de test...\n");

  // Récupérer les catégories
  const categories = await getCategories();
  console.log("📁 Catégories disponibles:", Object.keys(categories).join(", "));

  if (Object.keys(categories).length === 0) {
    console.log("❌ Aucune catégorie trouvée. Créez d'abord des catégories.");
    return;
  }

  let createdProducts = 0;
  let createdLots = 0;

  for (const product of TEST_PRODUCTS) {
    const categoryId = categories[product.category];

    if (!categoryId) {
      console.log(`⚠️  Catégorie "${product.category}" non trouvée, produit ignoré: ${product.name}`);
      continue;
    }

    const slug = `test-${generateSlug(product.name)}-${Date.now().toString(36)}`;
    const sku = `${TEST_SKU_PREFIX}${Date.now().toString(36).toUpperCase()}`;
    const images = JSON.stringify(getRandomImages(3));

    try {
      // Insérer le produit
      const [insertedProduct] = await sql`
        INSERT INTO products (
          name, slug, description, price, category_id, images,
          sku, stock, is_active, is_featured, is_new, is_bestseller, sort_order
        ) VALUES (
          ${TEST_PREFIX + " " + product.name},
          ${slug},
          ${"Produit de test: " + product.name + ". Description exemple pour les tests."},
          ${product.price},
          ${categoryId},
          ${images}::jsonb,
          ${sku},
          ${product.hasLots ? 0 : 20},
          true,
          ${product.isFeatured || false},
          ${product.isNew || false},
          ${product.isBestseller || false},
          ${createdProducts}
        )
        RETURNING id, name
      `;

      createdProducts++;
      console.log(`✅ Produit créé: ${insertedProduct.name}`);

      // Créer les lots si nécessaire
      if (product.hasLots) {
        for (let i = 0; i < LOTS_CONFIG.length; i++) {
          const lot = LOTS_CONFIG[i];
          const lotPrice = Math.round(product.price * lot.priceMultiplier);
          const lotImages = JSON.stringify(getRandomImages(2));

          await sql`
            INSERT INTO product_lots (
              product_id, name, price, images, stock, is_available, sort_order
            ) VALUES (
              ${insertedProduct.id},
              ${lot.name},
              ${lotPrice},
              ${lotImages}::jsonb,
              ${lot.stock},
              true,
              ${i}
            )
          `;
          createdLots++;
        }
        console.log(`   └─ ${LOTS_CONFIG.length} lots créés`);
      }

    } catch (error) {
      console.error(`❌ Erreur pour ${product.name}:`, error.message);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`📊 Résumé:`);
  console.log(`   - Produits créés: ${createdProducts}`);
  console.log(`   - Lots créés: ${createdLots}`);
  console.log("=".repeat(50));
  console.log("\n💡 Pour supprimer ces produits: node scripts/seed-test-products.mjs delete\n");
}

async function deleteTestProducts() {
  console.log("🗑️  Suppression des produits de test...\n");

  try {
    // Compter les produits à supprimer
    const [countResult] = await sql`
      SELECT COUNT(*) as count FROM products WHERE name LIKE ${TEST_PREFIX + "%"}
    `;

    const count = parseInt(countResult.count);

    if (count === 0) {
      console.log("ℹ️  Aucun produit de test à supprimer.");
      return;
    }

    console.log(`🔍 ${count} produit(s) de test trouvé(s)`);

    // Supprimer les produits (les lots seront supprimés en cascade)
    await sql`
      DELETE FROM products WHERE name LIKE ${TEST_PREFIX + "%"}
    `;

    console.log(`✅ ${count} produit(s) de test supprimé(s) avec leurs lots.`);

  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error.message);
  }
}

async function main() {
  const action = process.argv[2];

  if (action === "delete") {
    await deleteTestProducts();
  } else {
    await createTestProducts();
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("Erreur fatale:", error);
  process.exit(1);
});
