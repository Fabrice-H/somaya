"use client";

import { MapPin, Phone, MessageCircle, Clock, Truck, ShoppingBag, Calendar, Store } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const services = [
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Livraison",
    description: "Livraison rapide dans tout Abidjan",
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: "Retrait en boutique",
    description: "Récupérez votre commande en magasin",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Réservation en ligne",
    description: "Réservez vos articles à l'avance",
  },
  {
    icon: <Store className="w-6 h-6" />,
    title: "Shopping en boutique",
    description: "Venez découvrir notre collection",
  },
];

export function ContactContent() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-som" style={{ paddingTop: "clamp(30px, 4vw, 50px)" }}>
        <Breadcrumb items={[{ label: "Contact" }]} />
      </div>

      {/* Hero Section */}
      <section
        style={{
          padding: "clamp(40px, 6vw, 80px) 40px",
          background: "var(--som-cream)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div className="section-eyebrow-burgundy">Nous Contacter</div>
          <h1 className="section-title" style={{ marginBottom: "20px" }}>
            Rendez-nous visite
          </h1>
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              color: "var(--som-text-light)",
              margin: 0,
            }}
          >
            Notre équipe est à votre disposition pour vous accompagner dans vos choix
            et répondre à toutes vos questions.
          </p>
        </div>
      </section>

      {/* Contact Info + Map Section */}
      <section className="section-padding" style={{ background: "#fff" }}>
        <div className="container-som">
          <div className="grid-cols-2-responsive" style={{ gap: "clamp(40px, 5vw, 80px)" }}>
            {/* Contact Information */}
            <div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 500,
                  fontSize: "clamp(24px, 3vw, 32px)",
                  color: "var(--som-text)",
                  marginBottom: "32px",
                }}
              >
                Informations de contact
              </h2>

              {/* Address */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "28px",
                  paddingBottom: "28px",
                  borderBottom: "1px solid rgba(81, 31, 41, 0.1)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--som-peach-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--som-burgundy)",
                    flexShrink: 0,
                  }}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--som-text)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Adresse
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.6,
                      color: "var(--som-text-light)",
                      margin: 0,
                    }}
                  >
                    Angré Château<br />
                    Non loin du Collège International les Vallées d&apos;Angré<br />
                    08 BP 2190 Abj 08
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "28px",
                  paddingBottom: "28px",
                  borderBottom: "1px solid rgba(81, 31, 41, 0.1)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--som-peach-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--som-burgundy)",
                    flexShrink: 0,
                  }}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--som-text)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Téléphone
                  </h3>
                  <a
                    href="tel:+2250778784268"
                    style={{
                      fontSize: "15px",
                      color: "var(--som-burgundy)",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    +225 07 78 78 42 68
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "28px",
                  paddingBottom: "28px",
                  borderBottom: "1px solid rgba(81, 31, 41, 0.1)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--som-peach-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--som-burgundy)",
                    flexShrink: 0,
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--som-text)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    WhatsApp
                  </h3>
                  <a
                    href="https://wa.me/2250508905666"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "15px",
                      color: "var(--som-burgundy)",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    +225 05 08 90 56 66
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--som-peach-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--som-burgundy)",
                    flexShrink: 0,
                  }}
                >
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--som-text)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Horaires
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.6,
                      color: "var(--som-text-light)",
                      margin: 0,
                    }}
                  >
                    Lun - Sam : 9h00 - 19h00<br />
                    Dimanche : Fermé
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: "14px", marginTop: "40px", flexWrap: "wrap" }}>
                <a
                  href="https://wa.me/2250508905666?text=Bonjour%20SO'MAYA%20!%20Je%20souhaite%20avoir%20des%20informations."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                  style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Écrire sur WhatsApp</span>
                </a>
                <a
                  href="tel:+2250778784268"
                  className="btn-secondary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
                >
                  <Phone className="w-5 h-5" />
                  <span>Appeler</span>
                </a>
              </div>
            </div>

            {/* Map */}
            <div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "75%",
                  background: "var(--som-cream-dark)",
                  overflow: "hidden",
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.9631550495205!2d-3.9620294!3d5.4225692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1930016d4bcdf%3A0x566d63be49c7de8d!2sSO'MAYA!5e0!3m2!1sfr!2sci!4v1785570866631!5m2!1sfr!2sci"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Localisation SO'MAYA - Angré Château, Abidjan"
                />
              </div>
              <a
                href="https://maps.google.com/?q=SO'MAYA+Angré+Château+Abidjan"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "16px",
                  fontSize: "13px",
                  color: "var(--som-burgundy)",
                  textDecoration: "none",
                }}
              >
                <MapPin className="w-4 h-4" />
                Ouvrir dans Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding" style={{ background: "var(--som-burgundy)" }}>
        <div className="container-som">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <div className="section-eyebrow-peach">Nos Services</div>
            <h2 className="section-title-light">Ce que nous proposons</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {services.map((service) => (
              <div
                key={service.title}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "32px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    background: "rgba(252, 211, 180, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--som-peach)",
                    margin: "0 auto 20px",
                  }}
                >
                  {service.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "var(--som-peach)",
                    marginBottom: "10px",
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.7)",
                    margin: 0,
                  }}
                >
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="section-padding" style={{ background: "var(--som-cream)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "0 20px" }}>
          <div className="section-eyebrow-burgundy">Suivez-nous</div>
          <h2 className="section-title" style={{ marginBottom: "20px" }}>
            Restez connectés
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "var(--som-text-light)",
              marginBottom: "32px",
            }}
          >
            Suivez-nous sur les réseaux sociaux pour découvrir nos dernières collections,
            nos offres exclusives et les coulisses de SO&apos;MAYA.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <a
              href="https://www.instagram.com/so_maya_ci/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "50px",
                height: "50px",
                background: "var(--som-burgundy)",
                color: "var(--som-peach)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
              aria-label="Instagram"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/MadeyaCado"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "50px",
                height: "50px",
                background: "var(--som-burgundy)",
                color: "var(--som-peach)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
              aria-label="Facebook"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@somayashop"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "50px",
                height: "50px",
                background: "var(--som-burgundy)",
                color: "var(--som-peach)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
              aria-label="TikTok"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
            <a
              href="https://wa.me/2250508905666"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "50px",
                height: "50px",
                background: "var(--som-whatsapp)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
              aria-label="WhatsApp"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6a8.5 8.5 0 1 1 16.1-3.9z" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
