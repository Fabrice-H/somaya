import type { ProductColor, ProductCategory } from "@/lib/schemas";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  description: string;
  colors: ProductColor[];
  sizes?: string[];
  badge?: string;
  isBestseller?: boolean;
  isNew?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  label: string;
  subtitle: string;
  image: string;
}

export interface LookbookItem {
  id: string;
  image: string;
  label: string;
  height?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  text: string;
  rating: number;
}

// Products Data
export const products: Product[] = [
  {
    id: "1",
    name: "Ensemble Boubou Élégance",
    category: "Boubous",
    price: 45000,
    oldPrice: 55000,
    image: "/images/products/so_maya_ci_1776781082_3880233341219782649_13316418128.jpg",
    images: [
      "/images/products/so_maya_ci_1776781082_3880233341219782649_13316418128.jpg",
      "/images/products/so_maya_ci_1776781082_3880233345397320856_13316418128-787b3e53.jpg",
    ],
    description: "Boubou en bazin riche avec broderies dorées. Coupe élégante et confortable pour toutes les occasions.",
    colors: ["blanc", "creme", "or"],
    sizes: ["S", "M", "L", "XL"],
    badge: "Best-seller",
    isBestseller: true,
  },
  {
    id: "2",
    name: "Sac Cuir Tressé Camel",
    category: "Sacs",
    price: 28000,
    image: "/images/products/so_maya_ci_1763665764_3770224151630499569_13316418128.jpg",
    images: [
      "/images/products/so_maya_ci_1763665764_3770224151630499569_13316418128.jpg",
      "/images/products/so_maya_ci_1763665764_3770224151630503380_13316418128.jpg",
    ],
    description: "Sac à main en cuir véritable avec finition tressée artisanale. Parfait pour un look chic au quotidien.",
    colors: ["camel", "noir"],
    badge: "Nouveau",
    isNew: true,
    isBestseller: true,
  },
  {
    id: "3",
    name: "Montre Rose Gold Deluxe",
    category: "Montres",
    price: 35000,
    oldPrice: 42000,
    image: "/images/products/so_maya_ci_1764407987_3776450373553282721_13316418128.jpg",
    images: [
      "/images/products/so_maya_ci_1764407987_3776450373553282721_13316418128.jpg",
      "/images/products/so_maya_ci_1764407987_3776450373536488876_13316418128.jpg",
    ],
    description: "Montre élégante avec bracelet en acier rose gold. Cadran nacré avec détails dorés.",
    colors: ["or", "blanc"],
    isBestseller: true,
  },
  {
    id: "4",
    name: "Parure Bijoux Dorée",
    category: "Bijoux",
    price: 22000,
    image: "/images/products/so_maya_ci_1762182114_3757778391685137651_13316418128.jpg",
    images: [
      "/images/products/so_maya_ci_1762182114_3757778391685137651_13316418128.jpg",
      "/images/products/so_maya_ci_1762182114_3757778391685193404_13316418128.jpg",
    ],
    description: "Set complet collier et boucles d'oreilles en plaqué or. Design moderne inspiré de l'artisanat africain.",
    colors: ["or"],
    isBestseller: true,
  },
  {
    id: "5",
    name: "Tunique Wax Colorée",
    category: "Femmes",
    price: 18000,
    image: "/images/products/so_maya_ci_1718189738_3388743601078025384_13316418128.jpg",
    images: [
      "/images/products/so_maya_ci_1718189738_3388743601078025384_13316418128.jpg",
      "/images/products/so_maya_ci_1718189738_3388743601078095746_13316418128.jpg",
    ],
    description: "Tunique légère en wax authentique. Coupe moderne et confortable pour un style unique.",
    colors: ["orange", "bleu", "vert"],
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
  },
  {
    id: "6",
    name: "Boubou Homme Premium",
    category: "Hommes",
    price: 55000,
    image: "/images/products/so_maya_ci_1741723913_3586162563608962394_13316418128.jpg",
    images: [
      "/images/products/so_maya_ci_1741723913_3586162563608962394_13316418128.jpg",
      "/images/products/so_maya_ci_1741723913_3586162562350469245_13316418128-12b19a70.jpg",
    ],
    description: "Boubou homme en bazin super riche. Broderies traditionnelles et coupe ajustée moderne.",
    colors: ["blanc", "bleu", "noir"],
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    id: "7",
    name: "Bracelet Perles Africaines",
    category: "Bijoux",
    price: 8500,
    image: "/images/products/so_maya_ci_1763485792_3768714435804821184_13316418128.jpg",
    images: [
      "/images/products/so_maya_ci_1763485792_3768714435804821184_13316418128.jpg",
      "/images/products/so_maya_ci_1763485792_3768714435796442951_13316418128.jpg",
    ],
    description: "Bracelet artisanal en perles africaines traditionnelles. Fait main avec amour.",
    colors: ["orange", "rouge", "bleu"],
    isNew: true,
  },
  {
    id: "8",
    name: "Sac Bandoulière Luxe",
    category: "Sacs",
    price: 32000,
    image: "/images/products/so_maya_ci_1776869398_3880983810116422374_13316418128.jpg",
    images: [
      "/images/products/so_maya_ci_1776869398_3880983810116422374_13316418128.jpg",
      "/images/products/so_maya_ci_1776869398_3880983811945154212_13316418128.jpg",
    ],
    description: "Sac bandoulière en cuir premium avec détails dorés. Élégant et pratique.",
    colors: ["noir", "camel"],
  },
  {
    id: "9",
    name: "Ensemble Bazin Festif",
    category: "Boubous",
    price: 65000,
    image: "/images/products/so_maya_ci_1741811404_3586896492813087866_13316418128-4f4a5b98.jpg",
    images: [
      "/images/products/so_maya_ci_1741811404_3586896492813087866_13316418128-4f4a5b98.jpg",
      "/images/products/so_maya_ci_1741811404_3586896493131647525_13316418128.jpg",
    ],
    description: "Ensemble complet en bazin getzner. Broderies luxueuses pour les grandes occasions.",
    colors: ["or", "blanc", "creme"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "10",
    name: "Montre Classique Homme",
    category: "Montres",
    price: 38000,
    image: "/images/products/so_maya_ci_1717756666_3385110727846056870_13316418128-6da888e9.jpg",
    images: [
      "/images/products/so_maya_ci_1717756666_3385110727846056870_13316418128-6da888e9.jpg",
      "/images/products/so_maya_ci_1717756666_3385110727745480551_13316418128.jpg",
    ],
    description: "Montre homme avec bracelet en cuir véritable. Mouvement quartz précis et fiable.",
    colors: ["noir", "camel"],
  },
  {
    id: "11",
    name: "Robe Ankara Moderne",
    category: "Femmes",
    price: 24000,
    image: "/images/products/so_maya_ci_1718012343_3387255504574210537_13316418128-8cd42d51.jpg",
    images: [
      "/images/products/so_maya_ci_1718012343_3387255504574210537_13316418128-8cd42d51.jpg",
      "/images/products/so_maya_ci_1718012343_3387255504255434625_13316418128-1819c16c.jpg",
    ],
    description: "Robe élégante en tissu ankara. Coupe ajustée et imprimé vibrant.",
    colors: ["orange", "violet", "bleu"],
    sizes: ["S", "M", "L"],
    badge: "Nouveau",
    isNew: true,
  },
  {
    id: "12",
    name: "Collier Statement Or",
    category: "Bijoux",
    price: 15000,
    image: "/images/products/so_maya_ci_1741899776_3587637813512891883_13316418128.jpg",
    images: [
      "/images/products/so_maya_ci_1741899776_3587637813512891883_13316418128.jpg",
      "/images/products/so_maya_ci_1741899776_3587637813512891883_13316418128-96f8f884.jpg",
    ],
    description: "Collier statement en plaqué or 18k. Pièce maîtresse pour sublimer toutes vos tenues.",
    colors: ["or"],
  },
];

// Collections Data - Ordered to show featured categories first
export const collections: Collection[] = [
  {
    id: "1",
    name: "Sacs",
    slug: "sacs",
    label: "Maroquinerie",
    subtitle: "Cuir véritable et finitions premium",
    image: "/images/so_maya_ci_1762182114_3757778391685137651_13316418128.jpg",
  },
  {
    id: "2",
    name: "Montres",
    slug: "montres",
    label: "Horlogerie",
    subtitle: "Élégance au quotidien",
    image: "/images/so_maya_ci_1763665764_3770224151630499569_13316418128.jpg",
  },
  {
    id: "3",
    name: "Boubous",
    slug: "boubous",
    label: "Tradition",
    subtitle: "Bazin riche et broderies",
    image: "/images/so_maya_ci_1776869398_3880983810116422374_13316418128.jpg",
  },
  {
    id: "4",
    name: "Femmes",
    slug: "femmes",
    label: "Collection",
    subtitle: "Robes, tuniques et ensembles",
    image: "/images/so_maya_ci_1718189738_3388743601078025384_13316418128.jpg",
  },
  {
    id: "5",
    name: "Hommes",
    slug: "hommes",
    label: "Collection",
    subtitle: "Boubous et tenues traditionnelles",
    image: "/images/so_maya_ci_1741723913_3586162563608962394_13316418128.jpg",
  },
  {
    id: "6",
    name: "Bijoux",
    slug: "bijoux",
    label: "Accessoires",
    subtitle: "Colliers, bracelets et boucles",
    image: "/images/so_maya_ci_1764407987_3776450373553282721_13316418128.jpg",
  },
];

// Lookbook Items
export const lookbookItems: LookbookItem[] = [
  {
    id: "1",
    image: "/images/so_maya_ci_1776781082_3880233341219782649_13316418128.jpg",
    label: "Boubou Élégance",
    height: "450px",
  },
  {
    id: "2",
    image: "/images/so_maya_ci_1763665764_3770224151630499569_13316418128.jpg",
    label: "Sac Cuir Tressé",
    height: "350px",
  },
  {
    id: "3",
    image: "/images/so_maya_ci_1764407987_3776450373553282721_13316418128.jpg",
    label: "Montre Rose Gold",
    height: "400px",
  },
  {
    id: "4",
    image: "/images/so_maya_ci_1762182114_3757778391685137651_13316418128.jpg",
    label: "Parure Dorée",
    height: "320px",
  },
  {
    id: "5",
    image: "/images/so_maya_ci_1718189738_3388743601078025384_13316418128.jpg",
    label: "Tunique Wax",
    height: "420px",
  },
  {
    id: "6",
    image: "/images/so_maya_ci_1741723913_3586162563608962394_13316418128.jpg",
    label: "Boubou Homme",
    height: "380px",
  },
  {
    id: "7",
    image: "/images/so_maya_ci_1763485792_3768714435804821184_13316418128.jpg",
    label: "Bracelet Perles",
    height: "300px",
  },
  {
    id: "8",
    image: "/images/so_maya_ci_1776869398_3880983810116422374_13316418128.jpg",
    label: "Sac Bandoulière",
    height: "360px",
  },
];

// Testimonials
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Aminata K.",
    location: "Cocody, Abidjan",
    image: "/images/so_maya_ci_1718189738_3388743601078025384_13316418128.jpg",
    text: "J'ai découvert SO'MAYA sur Instagram et j'ai tout de suite été séduite par la qualité des bijoux. Le service client est exceptionnel, très réactif sur WhatsApp. Je recommande vivement !",
    rating: 5,
  },
  {
    id: 2,
    name: "Fatou D.",
    location: "Plateau, Abidjan",
    image: "/images/so_maya_ci_1741723913_3586162563608962394_13316418128.jpg",
    text: "Mes boubous préférés viennent tous de SO'MAYA. La qualité des tissus et les finitions sont impeccables. C'est devenu ma boutique de référence pour les grandes occasions.",
    rating: 5,
  },
  {
    id: 3,
    name: "Mariam T.",
    location: "Marcory, Abidjan",
    image: "/images/so_maya_ci_1763665764_3770224151630499569_13316418128.jpg",
    text: "Le sac que j'ai commandé est encore plus beau en vrai qu'en photo. La livraison a été rapide et le packaging très soigné. Une vraie expérience premium.",
    rating: 5,
  },
];

// Instagram Posts
export const instagramPosts: string[] = [
  "/images/so_maya_ci_1776781082_3880233341219782649_13316418128.jpg",
  "/images/so_maya_ci_1763665764_3770224151630499569_13316418128.jpg",
  "/images/so_maya_ci_1764407987_3776450373553282721_13316418128.jpg",
  "/images/so_maya_ci_1762182114_3757778391685137651_13316418128.jpg",
  "/images/so_maya_ci_1718189738_3388743601078025384_13316418128.jpg",
  "/images/so_maya_ci_1741723913_3586162563608962394_13316418128.jpg",
];

// Why Choose Reasons
export const whyChooseReasons = [
  {
    num: "I",
    title: "Qualité Premium",
    desc: "Tissus nobles et finitions impeccables pour des pièces durables et intemporelles",
  },
  {
    num: "II",
    title: "Style Africain",
    desc: "Designs authentiques célébrant le riche patrimoine textile de l'Afrique",
  },
  {
    num: "III",
    title: "Livraison Soignée",
    desc: "Emballage premium et livraison rapide avec suivi sécurisé",
  },
  {
    num: "IV",
    title: "Paiement Sécurisé",
    desc: "Transactions protégées avec les meilleures technologies de chiffrement",
  },
  {
    num: "V",
    title: "Service Client",
    desc: "Équipe SO'MAYA disponible pour accompagner votre expérience",
  },
];

// Helper Functions
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-CI", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(price) + " FCFA";
}

export function getWhatsAppLink(product: Product): string {
  const message = encodeURIComponent(
    `Bonjour SO'MAYA ! Je suis intéressé(e) par ${product.name} à ${formatPrice(product.price)}. Pouvez-vous me donner plus d'informations ?`
  );
  return `https://wa.me/2250778784268?text=${message}`;
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.isBestseller);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
  );
}

export function createWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/2250778784268?text=${encoded}`;
}

// Alias for backwards compatibility
export const categories = collections;
