"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { FeaturedCollectionData } from "@/features/admin/featured-collection/actions";

// Default images for fallback (using existing images)
const DEFAULT_IMAGES = [
  "/images/so_maya_ci_1780747898_3913519226406721244_13316418128.jpg",
  "/images/so_maya_ci_1718012343_3387255504255434625_13316418128-1819c16c.jpg",
  "/images/646052596_1498385462288033_6860984962415097710_n.jpg",
];

interface NewCollectionSectionProps {
  data?: FeaturedCollectionData | null;
}

// ============================================================
// Client Component - NewCollectionSection
// Style Telo - Clean, Modern, Rounded, Mobile-first with Tailwind
// ============================================================

export default function NewCollectionSection({ data }: NewCollectionSectionProps) {
  if (data && !data.is_active) {
    return null;
  }

  const eyebrow = data?.eyebrow || "Nouvelle saison";
  const title = data?.title || "Collection Cérémonie";
  const description = data?.description || "Boubous d'exception, satins profonds et broderies dorées. Une garde-robe pensée pour les grandes occasions.";
  const stat1Value = data?.stat1_value || "48";
  const stat1Label = data?.stat1_label || "Nouvelles pièces";
  const stat2Value = data?.stat2_value || "100%";
  const stat2Label = data?.stat2_label || "Fait main";
  const buttonText = data?.button_text || "Voir la collection";
  const buttonLink = data?.button_link || "/catalogue";
  const images = data?.images?.length ? data.images : DEFAULT_IMAGES;

  return (
    <section id="nouveautes" className="bg-[#faf6f1] py-6 px-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col md:grid md:grid-cols-[1.2fr_1fr] gap-4 md:gap-6 md:min-h-[500px] lg:min-h-[600px] animate-fade-in">
        {/* Content Card - Below on mobile, Left on desktop */}
        <div className="order-2 md:order-1 bg-[#511F29] rounded-2xl p-6 md:p-8 lg:p-12 flex flex-col justify-center">
          {/* Eyebrow */}
          <span className="text-[11px] tracking-[0.2em] uppercase text-[#fcd3b4]/70 mb-5">
            {eyebrow}
          </span>

          {/* Title */}
          <h2 className="font-serif font-normal text-[#fbf3ec] text-[28px] md:text-[36px] lg:text-[48px] leading-[1.1] mb-4 tracking-tight">
            {title}
          </h2>

          {/* Description */}
          <p className="text-[#fbf3ec]/70 text-[14px] leading-relaxed mb-6 md:mb-8 max-w-[380px]">
            {description}
          </p>

          {/* Stats */}
          {(stat1Value || stat2Value) && (
            <div className="flex gap-8 mb-8">
              {stat1Value && (
                <div>
                  <div className="font-serif text-[24px] md:text-[32px] lg:text-[40px] text-[#fcd3b4] leading-none">
                    {stat1Value}
                  </div>
                  <div className="text-[10px] tracking-wide uppercase text-[#fbf3ec]/50 mt-1.5">
                    {stat1Label}
                  </div>
                </div>
              )}
              {stat2Value && (
                <div>
                  <div className="font-serif text-[24px] md:text-[32px] lg:text-[40px] text-[#fcd3b4] leading-none">
                    {stat2Value}
                  </div>
                  <div className="text-[10px] tracking-wide uppercase text-[#fbf3ec]/50 mt-1.5">
                    {stat2Label}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Button */}
          <Link
            href={buttonLink}
            className="group inline-flex items-center gap-2 bg-[#fcd3b4] text-[#511F29] text-[12px] font-semibold tracking-wide uppercase py-3.5 px-7 rounded-md self-start transition-all hover:bg-white"
          >
            {buttonText}
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Images Grid - Above on mobile, Right on desktop */}
        <div className="order-1 md:order-2 grid grid-cols-3 md:grid-cols-2 gap-2 md:gap-4 md:grid-rows-2">
          {/* Large Image - Full width on mobile, spans 2 rows on desktop */}
          <div className="relative rounded-xl overflow-hidden bg-[#ece0d3] aspect-square col-span-2 md:col-span-1 md:row-span-2 md:aspect-auto group">
            {images[0] && (
              <Image
                src={images[0]}
                alt={title}
                fill
                className="object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 66vw, 35vw"
              />
            )}
          </div>

          {/* Small Image 1 */}
          <div className="relative rounded-xl overflow-hidden bg-[#ece0d3] aspect-[3/4] md:aspect-auto group">
            {images[1] && (
              <Image
                src={images[1]}
                alt="Détail"
                fill
                className="object-cover object-[center_18%] transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 33vw, 20vw"
              />
            )}
          </div>

          {/* Small Image 2 - Hidden on mobile, visible on desktop */}
          <div className="relative rounded-xl overflow-hidden bg-[#ece0d3] aspect-[3/4] md:aspect-auto group hidden md:block">
            {images[2] && (
              <Image
                src={images[2]}
                alt="Texture"
                fill
                className="object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105"
                sizes="20vw"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
