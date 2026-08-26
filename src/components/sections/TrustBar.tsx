// ============================================================
// TrustBar - Simple trust indicators bar after hero
// ============================================================

import { Truck, RotateCcw, MessageCircle, Lock } from "lucide-react";

const trustItems = [
  {
    icon: Truck,
    title: "Livraison rapide",
    desc: "2 à 3 jours ouvrés",
  },
  {
    icon: RotateCcw,
    title: "Satisfait ou remboursé",
    desc: "30 jours pour changer d'avis",
  },
  {
    icon: MessageCircle,
    title: "Service client",
    desc: "100% proche de vous et réactif",
  },
  {
    icon: Lock,
    title: "Paiement sécurisé",
    desc: "Carte · PayPal · Wave",
  },
];

export function TrustBar() {
  return (
    <div
      style={{
        background: "var(--som-cream, #faf6f1)",
        borderBottom: "1px solid var(--som-burgundy, #511F29)",
        borderBottomColor: "rgba(81, 31, 41, 0.12)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "18px clamp(20px, 4vw, 40px)",
        }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          style={{
            justifyItems: "center",
          }}
        >
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <div
                style={{
                  color: "var(--som-burgundy, #511F29)",
                  flexShrink: 0,
                }}
              >
                <item.icon size={22} strokeWidth={1.3} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--som-text, #2a181d)",
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--som-burgundy, #511F29)",
                    opacity: 0.7,
                    lineHeight: 1.4,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
