"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { HomeHeroBanner } from "@/lib/queries/home";

// ============================================================
// Types
// ============================================================

interface HeroSectionProps {
  data?: HomeHeroBanner | null;
}

// Default values
const DEFAULTS = {
  eyebrow: "Maison de mode · Abidjan",
  title: "L'élégance",
  title_highlight: "commence",
  title_suffix: "ici.",
  description: "Des pièces sélectionnées pour accompagner chaque femme et chaque homme au quotidien.",
  button_text: "Découvrir la collection",
  button_link: "#collections",
  media_type: "image",
  media_url: "/images/so_maya_ci_1776781082_3880233341219782649_13316418128.jpg",
  media_position: "center 22%",
};

// ============================================================
// Client Component - HeroSection
// Design: Split layout with light neutral panel and image right
// ============================================================

export default function HeroSection({ data }: HeroSectionProps) {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Force autoplay on mobile (iOS Safari requires user interaction workaround)
  useEffect(() => {
    const playVideos = () => {
      if (desktopVideoRef.current) {
        desktopVideoRef.current.play().catch(() => {
          // Autoplay failed, user interaction required
        });
      }
      if (mobileVideoRef.current) {
        mobileVideoRef.current.play().catch(() => {
          // Autoplay failed, user interaction required
        });
      }
    };

    // Try to play immediately
    playVideos();

    // Also try on user interaction (for iOS)
    const handleInteraction = () => {
      playVideos();
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };

    document.addEventListener("touchstart", handleInteraction, { once: true });
    document.addEventListener("click", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };
  }, []);

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

  return (
    <>
      {/* Desktop Hero - 2 columns */}
      <section
        className="hero-desktop"
        style={{
          gridTemplateColumns: "1.05fr 1fr",
          minHeight: "600px",
          height: "88vh",
          maxHeight: "880px",
        }}
      >
        {/* Left Side - Content */}
        <div
          style={{
            background: "var(--som-primary-50)",
            display: "flex",
            alignItems: "center",
            padding: "60px clamp(40px, 6vw, 96px)",
          }}
        >
          <div style={{ maxWidth: "520px" }}>
            {/* Eyebrow with underline */}
            <div
              style={{
                display: "inline-block",
                fontSize: "11.5px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--som-primary)",
                marginBottom: "26px",
                borderBottom: "1px solid var(--som-primary-200)",
                paddingBottom: "7px",
              }}
            >
              {eyebrow}
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--font-stack)",
                fontWeight: 500,
                color: "#000000",
                fontSize: "clamp(40px, 4.6vw, 76px)",
                lineHeight: 1.04,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--som-accent)" }}>{titleHighlight}</em> {titleSuffix}
            </h1>

            {/* Description */}
            <p
              style={{
                color: "#4a4a4a",
                fontSize: "17px",
                lineHeight: 1.65,
                margin: "28px 0 38px",
                fontWeight: 300,
              }}
            >
              {description}
            </p>

            <Link href={buttonLink} className="btn-primary">
              {buttonText}
            </Link>
          </div>
        </div>

        {/* Right Side - Media */}
        <div style={{ position: "relative", overflow: "hidden", background: "var(--som-primary-100)" }}>
          {mediaType === "video" ? (
            <video
              ref={desktopVideoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: mediaPosition,
              }}
            >
              <source src={mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={mediaUrl}
              alt="SO'MAYA"
              fill
              style={{ objectFit: "cover", objectPosition: mediaPosition }}
              priority
            />
          )}
        </div>
      </section>

      {/* Mobile Hero - Full screen with overlay */}
      <section
        className="hero-mobile"
        style={{
          position: "relative",
          height: "85vh",
          minHeight: "500px",
          maxHeight: "700px",
          overflow: "hidden",
        }}
      >
        {/* Background Media */}
        {mediaType === "video" ? (
          <video
            ref={mobileVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: mediaPosition,
            }}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={mediaUrl}
            alt="SO'MAYA"
            fill
            style={{ objectFit: "cover", objectPosition: mediaPosition }}
            priority
          />
        )}

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            textAlign: "center",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.85)",
              marginBottom: "20px",
            }}
          >
            {eyebrow}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-stack)",
              fontWeight: 400,
              color: "#ffffff",
              fontSize: "clamp(42px, 12vw, 72px)",
              lineHeight: 1,
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-stack)",
              fontStyle: "italic",
              fontSize: "clamp(20px, 5vw, 28px)",
              color: "rgba(255,255,255,0.9)",
              margin: "8px 0 0",
              fontWeight: 300,
            }}
          >
            {titleHighlight} {titleSuffix}
          </p>

          {/* CTA Button */}
          <Link
            href={buttonLink}
            style={{
              marginTop: "40px",
              background: "transparent",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "18px 40px",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.5)",
              transition: "all 0.3s",
            }}
          >
            {buttonText}
          </Link>
        </div>
      </section>
    </>
  );
}
