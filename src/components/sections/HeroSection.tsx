"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { HomeHeroBanner } from "@/lib/queries/home";

// ============================================================
// Types
// ============================================================

interface HeroSectionProps {
  data?: HomeHeroBanner | null;
}

// Default values
const DEFAULTS = {
  layout: "split",
  eyebrow: "Maison de mode · Abidjan",
  title: "L'élégance",
  title_highlight: "africaine",
  title_suffix: "sublimée",
  description: "Des pièces uniques pour accompagner chaque femme et chaque homme au quotidien.",
  button_text: "Découvrir",
  button_link: "#collections",
  media_type: "image",
  media_url: "/images/so_maya_ci_1776781082_3880233341219782649_13316418128.jpg",
  media_position: "center center",
  background_color: "#511F29",
  text_color: "#fbf3ec",
  accent_color: "#fcd3b4",
};

// ============================================================
// Client Component - HeroSection
// Supports 3 layouts: split, centered, fullscreen
// ============================================================

export default function HeroSection({ data }: HeroSectionProps) {
  const layout = data?.layout || DEFAULTS.layout;
  const eyebrow = data?.eyebrow || DEFAULTS.eyebrow;
  const title = data?.title || DEFAULTS.title;
  const titleHighlight = data?.title_highlight || DEFAULTS.title_highlight;
  const titleSuffix = data?.title_suffix || DEFAULTS.title_suffix;
  const description = data?.description || DEFAULTS.description;
  const buttonText = data?.button_text || DEFAULTS.button_text;
  const buttonLink = data?.button_link || DEFAULTS.button_link;
  const mediaType = data?.media_type || DEFAULTS.media_type;
  const mediaUrl = data?.media_url || DEFAULTS.media_url;
  const mediaPosition = data?.media_position || DEFAULTS.media_position;
  const bgColor = data?.background_color || DEFAULTS.background_color;
  const textColor = data?.text_color || DEFAULTS.text_color;
  const accentColor = data?.accent_color || DEFAULTS.accent_color;

  // Render media element
  const renderMedia = () => (
    <>
      {mediaType === "video" ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: mediaPosition }}
        >
          <source src={mediaUrl} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={mediaUrl}
          alt="Hero"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: mediaPosition }}
        />
      )}
    </>
  );

  // ============================================================
  // Layout: SPLIT - Text on left, media on right
  // ============================================================
  if (layout === "split") {
    return (
      <section className="bg-[#faf6f1] p-4 md:p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto flex flex-col-reverse md:grid md:grid-cols-[1fr_1.3fr] gap-4 md:gap-6 md:min-h-[500px] lg:min-h-[600px]">
          {/* Content Card */}
          <div
            className="rounded-2xl p-6 md:p-8 lg:p-12 flex flex-col justify-center animate-fade-in"
            style={{ background: bgColor }}
          >
            <span
              className="text-[11px] tracking-[0.2em] uppercase mb-5"
              style={{ color: `${accentColor}99` }}
            >
              {eyebrow}
            </span>

            <h1
              className="font-serif font-normal text-[28px] md:text-[36px] lg:text-[52px] leading-[1.1] mb-4 tracking-tight animate-slide-up"
              style={{ color: textColor }}
            >
              {title}
              {titleHighlight && (
                <>
                  <br />
                  <em style={{ fontStyle: "italic", color: accentColor }}>{titleHighlight}</em>
                </>
              )}
              {titleSuffix && (
                <>
                  <br />
                  {titleSuffix}
                </>
              )}
            </h1>

            <p
              className="text-[14px] md:text-[15px] leading-relaxed mb-6 md:mb-8 max-w-[380px] animate-slide-up delay-1"
              style={{ color: `${textColor}cc` }}
            >
              {description}
            </p>

            <Link
              href={buttonLink}
              className="group inline-flex items-center gap-2.5 text-[12px] font-semibold tracking-wide uppercase py-4 px-6 md:px-8 rounded self-start transition-all animate-slide-up delay-2"
              style={{ background: accentColor, color: bgColor }}
            >
              {buttonText}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Media Card */}
          <div className="relative rounded-2xl overflow-hidden bg-[#ece0d3] min-h-[280px] md:min-h-0 aspect-[4/3] md:aspect-auto animate-fade-in">
            {renderMedia()}
            <div
              className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none"
              style={{ background: `linear-gradient(to top, ${bgColor}66, transparent)` }}
            />
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // Layout: CENTERED - Text centered on the media (overlay)
  // ============================================================
  if (layout === "centered") {
    return (
      <section className="bg-[#faf6f1] p-4 md:p-6 lg:p-8">
        <div className="relative max-w-[1400px] mx-auto min-h-[450px] md:min-h-[550px] lg:min-h-[650px] rounded-2xl overflow-hidden animate-fade-in">
          {/* Media Background */}
          {renderMedia()}

          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${bgColor}40 0%, ${bgColor}80 50%, ${bgColor}cc 100%)` }}
          />

          {/* Content - Centered */}
          <div className="relative h-full flex flex-col items-center justify-center text-center p-6 md:p-10 lg:p-14">
            <span
              className="text-[11px] tracking-[0.2em] uppercase mb-5 animate-slide-up"
              style={{ color: accentColor }}
            >
              {eyebrow}
            </span>

            <h1
              className="font-serif font-normal text-[32px] md:text-[48px] lg:text-[64px] leading-[1.1] mb-4 tracking-tight max-w-[800px] animate-slide-up delay-1"
              style={{ color: textColor }}
            >
              {title}
              {titleHighlight && (
                <>
                  {" "}
                  <em style={{ fontStyle: "italic", color: accentColor }}>{titleHighlight}</em>
                </>
              )}
              {titleSuffix && <> {titleSuffix}</>}
            </h1>

            <p
              className="text-[15px] md:text-[16px] leading-relaxed mb-8 max-w-[500px] animate-slide-up delay-2"
              style={{ color: `${textColor}cc` }}
            >
              {description}
            </p>

            <Link
              href={buttonLink}
              className="group inline-flex items-center gap-2.5 text-[12px] font-semibold tracking-wide uppercase py-4 px-8 rounded transition-all animate-slide-up delay-3"
              style={{ background: accentColor, color: bgColor }}
            >
              {buttonText}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // Layout: FULLWIDTH - Media with text at bottom (default)
  // ============================================================
  return (
    <section className="bg-[#faf6f1] p-4 md:p-6 lg:p-8">
      <div className="relative max-w-[1400px] mx-auto min-h-[450px] md:min-h-[600px] lg:min-h-[700px] rounded-2xl overflow-hidden animate-fade-in">
        {/* Media Background */}
        {renderMedia()}

        {/* Bottom Gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none"
          style={{ background: `linear-gradient(to top, ${bgColor}ee 0%, ${bgColor}99 40%, transparent 100%)` }}
        />

        {/* Content - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-14">
          <div className="max-w-[600px]">
            <span
              className="block text-[11px] tracking-[0.2em] uppercase mb-4 animate-slide-up"
              style={{ color: accentColor }}
            >
              {eyebrow}
            </span>

            <h1
              className="font-serif font-normal text-[28px] md:text-[40px] lg:text-[52px] leading-[1.15] mb-4 tracking-tight animate-slide-up delay-1"
              style={{ color: textColor }}
            >
              {title}
              {titleHighlight && (
                <>
                  {" "}
                  <em style={{ fontStyle: "italic", color: accentColor }}>{titleHighlight}</em>
                </>
              )}
              {titleSuffix && <> {titleSuffix}</>}
            </h1>

            <p
              className="text-[14px] md:text-[15px] leading-relaxed mb-6 max-w-[450px] animate-slide-up delay-2"
              style={{ color: `${textColor}bb` }}
            >
              {description}
            </p>

            <Link
              href={buttonLink}
              className="group inline-flex items-center gap-2.5 text-[12px] font-semibold tracking-wide uppercase py-4 px-6 md:px-8 rounded transition-all animate-slide-up delay-3"
              style={{ background: accentColor, color: bgColor }}
            >
              {buttonText}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
