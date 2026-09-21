import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { getFooterCategories, getStoreContact } from "@/features/settings/server/queries";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/shared/components/icons/SocialIcons";
import { LEGAL_LINKS } from "@/shared/config/navigation";
import { SITE } from "@/shared/config/site";
import { localPhone, telHref, whatsappHref } from "@/shared/lib/phone";
import { PaymentMethods } from "./footer/PaymentMethods";
import { Reassurance } from "./footer/Reassurance";

const headingClass = "mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--som-ink)]";
const linkClass = "text-[14px] text-[#4a4a4a] transition-colors hover:text-[var(--som-primary)]";

export async function Footer() {
  const [contact, categories] = await Promise.all([getStoreContact(), getFooterCategories()]);

  const shopLinks = [
    { label: "Nouveautés", href: "/#nouveautes" },
    ...categories.map((category) => ({ label: category.name, href: `/catalogue/${category.slug}` })),
    { label: "Par budget", href: "/lots" },
    { label: "Toute la boutique", href: "/catalogue" },
  ];

  const socials = [
    { label: "Instagram", href: `https://www.instagram.com/${contact.instagram}/`, Icon: InstagramIcon },
    {
      label: "Facebook",
      href: contact.facebook.startsWith("http") ? contact.facebook : `https://www.facebook.com/${contact.facebook}`,
      Icon: FacebookIcon,
    },
    { label: "TikTok", href: `https://www.tiktok.com/@${contact.tiktok}`, Icon: TikTokIcon },
  ];

  return (
    <>
      <Reassurance />

      <footer className="border-t border-[var(--som-primary-100)] bg-[var(--som-primary-50)] text-[var(--som-ink)]">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-3 md:px-8 md:py-14">
          <div>
            <p className="m-0 text-[24px] font-light tracking-[0.02em] text-[var(--som-primary)]">{SITE.name}</p>
            <p className="m-0 mt-2 text-[11px] uppercase tracking-[0.22em] text-[#5a5a5a]">{SITE.tagline}</p>
            <p className="mt-5 max-w-[320px] text-[14px] leading-relaxed text-[#4a4a4a]">
              Vêtements, sacs, montres et bijoux sélectionnés avec exigence, pour une élégance du quotidien comme des
              grandes occasions.
            </p>
            <ul className="-ml-3 m-0 mt-4 flex list-none p-0">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SITE.name} sur ${label}`}
                    className="flex h-11 w-11 items-center justify-center text-[var(--som-ink)] transition-colors hover:text-[var(--som-primary)]"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Boutique">
            <p className={headingClass}>Boutique</p>
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

          <div>
            <p className={headingClass}>Contact</p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              <li>
                <a href={telHref(contact.phone)} className={`${linkClass} inline-flex items-center gap-2.5`}>
                  <Phone size={16} strokeWidth={1.5} aria-hidden />
                  {localPhone(contact.phone)}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} inline-flex items-center gap-2.5`}
                >
                  <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
                  WhatsApp : {localPhone(contact.whatsapp)}
                </a>
              </li>
              {contact.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className={`${linkClass} inline-flex items-center gap-2.5 break-all`}
                  >
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

        <div className="border-t border-[var(--som-primary-100)] px-4 py-6 text-center">
          <PaymentMethods />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[12px] text-[#5a5a5a]">
            <span>
              © {new Date().getFullYear()} {SITE.name}
            </span>
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
