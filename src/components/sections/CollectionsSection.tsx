"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HomePageCategory } from "@/lib/queries/home";

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
function getCategoryImage(category: HomePageCategory): string | null {
  if (category.imageUrl) return category.imageUrl;
  return FALLBACK_IMAGES[category.slug] || FALLBACK_IMAGES.default;
}

// ============================================================
// Client Component - CollectionsSection
// SO'MAYA Brand Colors - Clean, Modern, Mobile-first with Tailwind
// ============================================================

export function CollectionsSection({ categories }: CollectionsSectionProps) {
  const displayCategories = categories.slice(0, 6);

  if (displayCategories.length === 0) {
    return null;
  }

  const [hero, second, third, ...rest] = displayCategories;

  return (
    <section id="collections" className="bg-[#faf6f1] py-10 md:py-14">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12">
        {/* Top Section - Mobile: stacked, Desktop: grid */}
        <div className="flex flex-col md:grid md:grid-cols-[1.6fr_1fr] md:grid-rows-2 gap-3 md:gap-4 mb-3 md:mb-4 md:h-[500px] lg:h-[600px]">
          {/* Hero Card */}
          {hero && (
            <Link
              href={`/catalogue/${hero.slug}`}
              className="group relative block rounded-xl overflow-hidden aspect-[4/5] md:aspect-auto md:row-span-2"
            >
              <Image
                src={getCategoryImage(hero)!}
                alt={hero.name}
                fill
                className="object-cover object-[center_15%] transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 55vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#511F29]/5 to-[#511F29]/60" />
              <div className="absolute left-4 md:left-6 lg:left-8 bottom-4 md:bottom-6 lg:bottom-8 right-4 md:right-6 lg:right-8">
                <h2 className="font-serif font-normal text-[28px] md:text-[36px] lg:text-[48px] text-[#fbf3ec] mb-2 leading-[1.1] tracking-tight">
                  {hero.name}
                </h2>
                <p className="text-[13px] text-[#fbf3ec]/80 mb-4 max-w-[360px] leading-relaxed line-clamp-2">
                  {hero.description || "Pièces uniques pour un style authentique"}
                </p>
                <span className="inline-flex items-center gap-1.5 bg-[#fcd3b4] text-[#511F29] py-3 px-6 text-[11px] font-semibold tracking-wide uppercase rounded">
                  Voir la collection
                </span>
              </div>
            </Link>
          )}

          {/* Side Cards - Mobile: side by side, Desktop: stacked */}
          <div className="grid grid-cols-2 md:contents gap-3">
            {/* Side Card 1 */}
            {second && (
              <Link
                href={`/catalogue/${second.slug}`}
                className="group relative block rounded-xl overflow-hidden aspect-[3/4] md:aspect-auto"
              >
                <Image
                  src={getCategoryImage(second)!}
                  alt={second.name}
                  fill
                  className="object-cover object-[center_20%] transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 35vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#511F29]/5 to-[#511F29]/40" />
                <div className="absolute top-3 md:top-5 left-3 md:left-5">
                  <h3 className="font-serif font-normal text-[18px] md:text-[24px] lg:text-[28px] text-[#fbf3ec] drop-shadow-lg">
                    {second.name}
                  </h3>
                </div>
              </Link>
            )}

            {/* Side Card 2 */}
            {third && (
              <Link
                href={`/catalogue/${third.slug}`}
                className="group relative block rounded-xl overflow-hidden aspect-[3/4] md:aspect-auto"
              >
                <Image
                  src={getCategoryImage(third)!}
                  alt={third.name}
                  fill
                  className="object-cover object-[center_20%] transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 35vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#511F29]/5 to-[#511F29]/40" />
                <div className="absolute top-3 md:top-5 left-3 md:left-5">
                  <h3 className="font-serif font-normal text-[18px] md:text-[24px] lg:text-[28px] text-[#fbf3ec] drop-shadow-lg">
                    {third.name}
                  </h3>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {/* Remaining category cards */}
          {rest.map((category) => (
            <Link
              key={category.id}
              href={`/catalogue/${category.slug}`}
              className="group relative block rounded-xl overflow-hidden aspect-[3/4]"
            >
              <Image
                src={getCategoryImage(category)!}
                alt={category.name}
                fill
                className="object-cover object-[center_20%] transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#511F29]/65" />
              <div className="absolute left-3 md:left-5 right-3 md:right-5 bottom-3 md:bottom-5 flex items-end justify-between">
                <h3 className="font-serif font-normal italic text-[16px] md:text-[20px] text-[#fbf3ec] leading-tight">
                  {category.name}
                </h3>
                <ArrowUpRight
                  size={18}
                  className="text-[#fcd3b4] flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </div>
            </Link>
          ))}

          {/* Text Block */}
          <div className="flex flex-col justify-center p-5 md:p-6 lg:p-8 bg-[#511F29] rounded-xl aspect-[3/4]">
            <h3 className="font-serif font-normal text-[24px] md:text-[32px] lg:text-[40px] text-[#fbf3ec] mb-3 leading-[1.1] tracking-tight">
              Mode
              <br />
              <em className="italic text-[#fcd3b4]">Tradition</em>
            </h3>
            <p className="text-[13px] text-[#fbf3ec]/70 mb-5 leading-relaxed">
              Tissus africains authentiques, conçus pour un style moderne.
            </p>
            <Link
              href="/catalogue"
              className="group inline-flex items-center justify-center gap-1.5 bg-[#fcd3b4] text-[#511F29] py-3.5 px-5 text-[11px] font-semibold tracking-wide uppercase rounded self-start"
            >
              Parcourir
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
