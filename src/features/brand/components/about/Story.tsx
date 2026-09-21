import Image from "next/image";
import { aboutBody, aboutEyebrow, aboutTitle } from "./typography";

export function Story({
  image,
  imageAlt,
  imagePosition = "center",
  imageLabel,
  eyebrowText,
  heading,
  reverse = false,
  children,
}: {
  image: string;
  imageAlt: string;
  imagePosition?: string;
  imageLabel?: string;
  eyebrowText: string;
  heading: string;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1240px] px-4 md:px-8 [&+&]:mt-20 md:[&+&]:mt-28">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
        <div
          className={`relative aspect-[4/5] w-full overflow-hidden bg-[var(--som-primary-50)] ${reverse ? "md:order-2" : ""}`}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
          {imageLabel && (
            <span className="absolute bottom-4 left-4 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--som-ink)]">
              {imageLabel}
            </span>
          )}
        </div>

        <div className={`max-w-[480px] ${reverse ? "md:order-1 md:justify-self-end" : ""}`}>
          <p className={aboutEyebrow}>{eyebrowText}</p>
          <h2 className={aboutTitle}>{heading}</h2>
          <div className={`${aboutBody} mt-6 flex flex-col gap-4`}>{children}</div>
        </div>
      </div>
    </section>
  );
}
