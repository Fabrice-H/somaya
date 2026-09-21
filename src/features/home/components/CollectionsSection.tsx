import Image from "next/image";
import Link from "next/link";
import type { HomePageCategory } from "@/features/home/server/queries";

// ============================================================
// Types
// ============================================================

interface CollectionsSectionProps {
  categories: HomePageCategory[];
}

// Default fallback images based on category slug
const FALLBACK_IMAGES: Record<string, string> = {
  sacs: "/images/so_maya_ci_1780747898_3913519226406721244_13316418128.jpg",
  femmes: "/images/so_maya_ci_1718012343_3387255504255434625_13316418128-1819c16c.jpg",
  hommes: "/images/boss.jpg",
  boubous: "/images/so_maya_ci_1780747898_3913519226406721244_13316418128.jpg",
  bijoux: "/images/646052596_1498385462288033_6860984962415097710_n.jpg",
  montres: "/images/646052596_1498385462288033_6860984962415097710_n.jpg",
  default: "/images/so_maya_ci_1780747898_3913519226406721244_13316418128.jpg",
};

// Get image URL with fallback
function getCategoryImage(category: HomePageCategory): string {
  if (category.imageUrl) return category.imageUrl;
  return FALLBACK_IMAGES[category.slug] || FALLBACK_IMAGES.default;
}

// ============================================================
// CollectionsSection
// Design: white storefront, 3-column tile grid, the last tile
// links to the whole shop
// ============================================================

export function CollectionsSection({ categories }: CollectionsSectionProps) {
  // 5 categories + the "Toute la boutique" tile = two full rows of 3
  const displayCategories = categories.slice(0, 5);

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <section
      id="collections"
      className="bg-white px-4 py-14 md:px-8 md:py-20"
      style={{ fontFamily: "var(--font-stack)" }}
    >
      <div className="mx-auto max-w-[1240px]">
        {/* Header */}
        <div className="mb-10 text-center md:mb-12">
          <h2
            className="m-0 text-[26px] font-semibold tracking-[0.06em] text-[var(--som-ink)] md:text-[36px]"
            style={{ fontFamily: "var(--font-stack)", lineHeight: 1.2 }}
          >
            SO&apos;MAYA
          </h2>
          <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.3em] text-[var(--som-gray)] md:text-[15px]">
            La qualité, notre référence
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-1 md:grid-cols-3">
          {displayCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/catalogue/${category.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden bg-[var(--som-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--som-ink)]"
            >
              <Image
                src={getCategoryImage(category)}
                alt={category.name}
                fill
                priority={index < 3}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                style={{ objectPosition: "center 22%" }}
                sizes="(max-width: 768px) 50vw, 400px"
              />

              {/* Bottom gradient for label legibility */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)",
                }}
              />

              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-5">
                <h3
                  className="m-0 text-[14px] font-semibold uppercase tracking-[0.08em] text-white md:text-[17px]"
                  style={{ fontFamily: "var(--font-stack)", lineHeight: 1.3 }}
                >
                  {category.name}
                </h3>
                <span className="mt-1.5 inline-block border-b border-white/80 pb-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white md:text-[11px]">
                  Je craque
                </span>
              </div>
            </Link>
          ))}

          {/* Whole shop tile */}
          <Link
            href="/catalogue"
            className="group flex aspect-[3/4] flex-col items-center justify-center bg-[var(--som-surface)] px-4 text-center transition-colors duration-300 bg-[#ebebe8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--som-ink)]"
          >
            <span className="text-[17px] font-semibold text-[var(--som-primary)] md:text-[22px]">
              Toute la boutique
            </span>
            <span className="mt-2 border-b border-[var(--som-primary)] pb-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--som-primary)] md:text-[11px]">
              Voir tout
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
