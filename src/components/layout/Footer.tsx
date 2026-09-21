import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Headset, Mail, MessageCircle, Phone, Truck } from "lucide-react";
import { getFooterData } from "@/lib/queries/footer";

// ============================================================
// Data
// ============================================================

const REASSURANCES = [
  {
    icon: BadgeCheck,
    title: "Qualité sélectionnée",
    text: "Chaque pièce est choisie et contrôlée avant mise en ligne.",
  },
  {
    icon: Truck,
    title: "Livraison rapide",
    text: "Abidjan en 24h, reste de la Côte d'Ivoire en 48-72h.",
  },
  {
    icon: Headset,
    title: "Conseil personnalisé",
    text: "Une équipe joignable par WhatsApp pour vous guider.",
  },
];

// Contact fallbacks when store settings are empty
const DEFAULT_CONTACT = {
  phone: "+225 07 78 78 42 68",
  whatsapp: "+225 05 08 90 56 66",
  instagram: "so_maya_ci",
  facebook: "https://www.facebook.com/MadeyaCado",
  tiktok: "somayashop",
};

// "+225 07 78 78 42 68" -> "07 78 78 42 68" (display) / "+2250778784268" (tel:)
const localNumber = (value: string) => value.replace(/^\+?225\s*/, "");
const digits = (value: string) => value.replace(/[^\d+]/g, "");

const LEGAL_LINKS = [
  { label: "Livraison & Retours", href: "/livraison-retours" },
  { label: "Conditions Générales", href: "/conditions-generales" },
  { label: "Confidentialité", href: "/politique-confidentialite" },
];

// Square logos are contained on their own brand color, wide ones fill the tile
const PAYMENT_METHODS = [
  { name: "Wave", logo: "/images/wave.webp", fit: "contain", bg: "#1dc4ff" },
  { name: "Orange Money", logo: "/images/orange_money.webp", fit: "contain", bg: "#000000" },
  { name: "MTN MoMo", logo: "/images/momo_money.webp", fit: "cover", bg: "#ffcb05" },
  { name: "Moov Money", logo: "/images/moov_money.webp", fit: "cover", bg: "#0066b3" },
] as const;

// Brand icons (lucide v1 no longer ships them)
function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.4 2.6 2.2 4.4 5 4.6" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H7v3.5h2V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" />
    </svg>
  );
}

const headingClass = "mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--som-ink)]";
const linkClass = "text-[14px] text-[#4a4a4a] transition-colors hover:text-[var(--som-primary)]";

// ============================================================
// Footer - light storefront: reassurance band + 3 columns
// ============================================================

export async function Footer() {
  const { categories, contact } = await getFooterData();
  const phone = contact.phone || DEFAULT_CONTACT.phone;
  const whatsapp = contact.whatsapp || DEFAULT_CONTACT.whatsapp;
  const instagram = (contact.instagram || DEFAULT_CONTACT.instagram).replace("@", "");
  const facebook = contact.facebook || DEFAULT_CONTACT.facebook;
  const tiktok = (contact.tiktok || DEFAULT_CONTACT.tiktok).replace("@", "");

  const shopLinks = [
    { label: "Nouveautés", href: "/#nouveautes" },
    ...categories.map((c) => ({ label: c.name, href: `/catalogue/${c.slug}` })),
    { label: "Par budget", href: "/lots" },
    { label: "Toute la boutique", href: "/catalogue" },
  ];

  const socials = [
    { label: "Instagram", href: `https://www.instagram.com/${instagram}/`, Icon: InstagramIcon },
    {
      label: "Facebook",
      href: facebook.startsWith("http") ? facebook : `https://www.facebook.com/${facebook}`,
      Icon: FacebookIcon,
    },
    { label: "TikTok", href: `https://www.tiktok.com/@${tiktok}`, Icon: TikTokIcon },
  ];

  return (
    <>
      {/* Reassurance band */}
      <section aria-label="Nos engagements" className="border-t border-[#ececec] bg-white px-4 py-12 md:py-16">
        <ul className="mx-auto grid max-w-[1240px] list-none gap-10 p-0 text-center md:grid-cols-3 md:gap-6">
          {REASSURANCES.map((item) => (
            <li key={item.title} className="flex flex-col items-center">
              <item.icon size={40} strokeWidth={1.25} className="text-[var(--som-primary)]" aria-hidden />
              <h3 className="m-0 mt-5 text-[14px] font-medium uppercase tracking-[0.04em] text-[var(--som-ink)] md:text-[15px]">
                {item.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-light leading-relaxed text-[var(--som-gray)]">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-[var(--som-primary-100)] bg-[var(--som-primary-50)] text-[var(--som-ink)]">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-3 md:px-8 md:py-14">
          {/* Brand */}
          <div>
            <div className="text-[24px] font-light tracking-[0.02em] text-[var(--som-primary)]">SO&apos;MAYA</div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#5a5a5a]">
              La qualité, notre référence
            </div>
            <p className="mt-5 max-w-[320px] text-[14px] leading-relaxed text-[#4a4a4a]">
              Vêtements, sacs, montres et bijoux sélectionnés avec exigence, pour une élégance du
              quotidien comme des grandes occasions.
            </p>
            <ul className="-ml-3 m-0 mt-4 flex list-none p-0">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`SO'MAYA sur ${label}`}
                    className="flex h-11 w-11 items-center justify-center text-[var(--som-ink)] transition-colors hover:text-[var(--som-primary)]"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <nav aria-label="Boutique">
            <div className={headingClass}>Boutique</div>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <div className={headingClass}>Contact</div>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              <li>
                <a href={`tel:${digits(phone)}`} className={`${linkClass} inline-flex items-center gap-2.5`}>
                  <Phone size={16} strokeWidth={1.5} aria-hidden />
                  {localNumber(phone)}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${digits(whatsapp).replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} inline-flex items-center gap-2.5`}
                >
                  <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
                  WhatsApp : {localNumber(whatsapp)}
                </a>
              </li>
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className={`${linkClass} inline-flex items-center gap-2.5 break-all`}>
                    <Mail size={16} strokeWidth={1.5} aria-hidden />
                    {contact.email}
                  </a>
                </li>
              )}
              <li>
                <Link href="/a-propos" className={linkClass}>
                  La marque
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>
                  Nous écrire
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment + legal */}
        <div className="border-t border-[var(--som-primary-100)] px-4 py-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#5a5a5a]">
            Paiement sécurisé par mobile money
          </div>
          <ul className="m-0 mt-3 flex list-none flex-wrap justify-center gap-2 p-0">
            {PAYMENT_METHODS.map((method) => (
              <li
                key={method.name}
                className="relative h-9 w-14 overflow-hidden rounded-[3px] border border-[#dcdcd8]"
                style={{ background: method.bg }}
              >
                <Image
                  src={method.logo}
                  alt={method.name}
                  fill
                  sizes="56px"
                  className={method.fit === "cover" ? "object-cover" : "object-contain"}
                />
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[12px] text-[#5a5a5a]">
            <span>© {new Date().getFullYear()} SO&apos;MAYA</span>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="py-2 hover:text-[var(--som-ink)]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
