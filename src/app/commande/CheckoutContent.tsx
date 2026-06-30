"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  User,
  MapPin,
  Truck,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { getProductById, formatPrice } from "@/data/products";

const WHATSAPP_NUMBER = "2250778784268";

export function CheckoutContent() {
  const router = useRouter();
  const { items, getItemCount, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Côte d'Ivoire");
  const [notes, setNotes] = useState("");
  const [shipping, setShipping] = useState<"abidjan" | "hors">("abidjan");
  const [payment, setPayment] = useState<"livraison" | "momo" | "virement">(
    "livraison"
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItems = Object.entries(items)
    .map(([productId, quantity]) => {
      const product = getProductById(productId);
      return { product, quantity };
    })
    .filter((item) => item.product !== undefined);

  const subtotal = cartItems.reduce((acc, { product, quantity }) => {
    if (!product) return acc;
    return acc + product.price * quantity;
  }, 0);

  const shippingCost = shipping === "abidjan" ? 1500 : 3000;
  const total = subtotal + shippingCost;
  const itemCount = getItemCount();

  const isFormValid = firstName && lastName && phone && city;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    // Build WhatsApp message
    const itemsList = cartItems
      .map(({ product, quantity }) => {
        if (!product) return "";
        return `• ${product.name} x${quantity} - ${formatPrice(product.price * quantity)}`;
      })
      .join("\n");

    const shippingLabel =
      shipping === "abidjan"
        ? "Livraison Abidjan (1 500 FCFA)"
        : "Livraison hors Abidjan (3 000 FCFA)";

    const paymentLabel =
      payment === "livraison"
        ? "Paiement à la livraison"
        : payment === "momo"
          ? "Mobile Money"
          : "Virement bancaire";

    const message = `
🛍️ *NOUVELLE COMMANDE SO'MAYA*

👤 *Client*
Nom: ${firstName} ${lastName}
Téléphone: +225 ${phone}
${email ? `Email: ${email}` : ""}

📍 *Adresse de livraison*
${address ? `${address}\n` : ""}${city}, ${country}
${notes ? `\nInstructions: ${notes}` : ""}

🛒 *Articles commandés*
${itemsList}

📦 *${shippingLabel}*
💳 *${paymentLabel}*

💰 *TOTAL: ${formatPrice(total)}*

Merci de confirmer ma commande ! 🙏
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Clear cart and redirect
    clearCart();
    window.open(whatsappUrl, "_blank");
    router.push("/");
  };

  if (!isMounted) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#faf6f1",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            background: "rgba(250,246,241,0.92)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(81,31,41,0.1)",
          }}
        >
          <div
            style={{
              maxWidth: "1180px",
              margin: "0 auto",
              padding: "0 32px",
              height: "70px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link href="/">
              <Image
                src="/images/logo_header.png"
                alt="SO'MAYA"
                width={136}
                height={34}
                style={{ height: "34px", width: "auto" }}
              />
            </Link>
          </div>
        </header>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 40px",
            textAlign: "center",
          }}
        >
          <ShoppingBag size={60} color="#c7ab9b" strokeWidth={1} />
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "32px",
              fontWeight: 500,
              color: "#2a181d",
              margin: "24px 0 12px",
            }}
          >
            Votre panier est vide
          </h1>
          <p style={{ fontSize: "15px", color: "#6e5a50", marginBottom: "32px" }}>
            Découvrez nos collections et trouvez la pièce parfaite.
          </p>
          <Link
            href="/catalogue"
            style={{
              background: "#511F29",
              color: "#fcd3b4",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "16px 32px",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            Découvrir la collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf6f1" }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          background: "rgba(250,246,241,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(81,31,41,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "0 32px",
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/">
            <Image
              src="/images/logo_header.png"
              alt="SO'MAYA"
              width={136}
              height={34}
              style={{ height: "34px", width: "auto" }}
            />
          </Link>
          <Link
            href="/catalogue"
            style={{
              position: "relative",
              color: "#2a181d",
              display: "inline-flex",
            }}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span
              style={{
                position: "absolute",
                top: "-7px",
                right: "-9px",
                background: "#511F29",
                color: "#fcd3b4",
                fontSize: "9px",
                fontWeight: 600,
                minWidth: "15px",
                height: "15px",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 3px",
              }}
            >
              {itemCount}
            </span>
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 32px" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#94786b",
            padding: "26px 0 0",
          }}
        >
          <Link
            href="/"
            style={{ color: "#94786b", textDecoration: "none" }}
          >
            Accueil
          </Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <Link
            href="/catalogue"
            style={{ color: "#94786b", textDecoration: "none" }}
          >
            Boutique
          </Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: "#511F29" }}>Commande</span>
        </div>

        {/* Title */}
        <div
          style={{
            padding: "18px 0 30px",
            borderBottom: "1px solid rgba(81,31,41,0.1)",
          }}
        >
          <div
            style={{
              fontSize: "11.5px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#94786b",
              marginBottom: "13px",
            }}
          >
            Étape finale
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              fontSize: "clamp(34px,4.5vw,52px)",
              lineHeight: 1,
              margin: 0,
              color: "#2a181d",
            }}
          >
            Finalisez votre commande
          </h1>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#6e5a50",
              fontWeight: 300,
              maxWidth: "540px",
              margin: "17px 0 0",
            }}
          >
            Renseignez vos coordonnées et validez. Votre commande sera envoyée{" "}
            <strong style={{ fontWeight: 600, color: "#2a181d" }}>
              directement sur WhatsApp
            </strong>
            , prête à être confirmée.
          </p>
        </div>

        {/* Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.55fr 1fr",
            gap: "32px",
            alignItems: "start",
            padding: "34px 0 64px",
          }}
        >
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              minWidth: 0,
            }}
          >
            {/* Personal Info */}
            <div
              style={{
                background: "#fff",
                border: "1px solid rgba(81,31,41,0.1)",
                borderRadius: "5px",
                padding: "26px 28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "13px",
                  marginBottom: "22px",
                }}
              >
                <span
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "5px",
                    background: "#511F29",
                    color: "#fcd3b4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <User size={17} strokeWidth={1.6} />
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "19px",
                      color: "#2a181d",
                      lineHeight: 1.1,
                    }}
                  >
                    Vos informations
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "#94786b", marginTop: "2px" }}
                  >
                    Pour vous contacter si besoin
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
              >
                <label style={{ display: "block" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "10.5px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#94786b",
                      marginBottom: "7px",
                    }}
                  >
                    Prénom *
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Aïcha"
                    required
                    style={{
                      width: "100%",
                      background: "#faf6f1",
                      border: "1px solid rgba(81,31,41,0.16)",
                      color: "#2a181d",
                      padding: "13px 14px",
                      fontSize: "14px",
                      borderRadius: "3px",
                      outline: "none",
                    }}
                  />
                </label>
                <label style={{ display: "block" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "10.5px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#94786b",
                      marginBottom: "7px",
                    }}
                  >
                    Nom *
                  </span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Koné"
                    required
                    style={{
                      width: "100%",
                      background: "#faf6f1",
                      border: "1px solid rgba(81,31,41,0.16)",
                      color: "#2a181d",
                      padding: "13px 14px",
                      fontSize: "14px",
                      borderRadius: "3px",
                      outline: "none",
                    }}
                  />
                </label>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  marginTop: "15px",
                }}
              >
                <label style={{ display: "block" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "10.5px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#94786b",
                      marginBottom: "7px",
                    }}
                  >
                    Téléphone WhatsApp *
                  </span>
                  <div
                    style={{
                      display: "flex",
                      border: "1px solid rgba(81,31,41,0.16)",
                      borderRadius: "3px",
                      overflow: "hidden",
                      background: "#faf6f1",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0 12px",
                        background: "#f1e8df",
                        fontSize: "13px",
                        color: "#511F29",
                        borderRight: "1px solid rgba(81,31,41,0.16)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      +225
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07 00 00 00 00"
                      required
                      style={{
                        flex: 1,
                        minWidth: 0,
                        background: "transparent",
                        border: "none",
                        color: "#2a181d",
                        padding: "13px 14px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                </label>
                <label style={{ display: "block" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "10.5px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#94786b",
                      marginBottom: "7px",
                    }}
                  >
                    Email{" "}
                    <span
                      style={{
                        textTransform: "none",
                        letterSpacing: 0,
                        color: "#b09a8d",
                      }}
                    >
                      (optionnel)
                    </span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    style={{
                      width: "100%",
                      background: "#faf6f1",
                      border: "1px solid rgba(81,31,41,0.16)",
                      color: "#2a181d",
                      padding: "13px 14px",
                      fontSize: "14px",
                      borderRadius: "3px",
                      outline: "none",
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Address */}
            <div
              style={{
                background: "#fff",
                border: "1px solid rgba(81,31,41,0.1)",
                borderRadius: "5px",
                padding: "26px 28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "13px",
                  marginBottom: "22px",
                }}
              >
                <span
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "5px",
                    background: "#511F29",
                    color: "#fcd3b4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={17} strokeWidth={1.6} />
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "19px",
                      color: "#2a181d",
                      lineHeight: 1.1,
                    }}
                  >
                    Adresse de livraison
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "#94786b", marginTop: "2px" }}
                  >
                    Où devons-nous livrer ?
                  </div>
                </div>
              </div>

              <label style={{ display: "block", marginBottom: "15px" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "10.5px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#94786b",
                    marginBottom: "7px",
                  }}
                >
                  Adresse complète
                </span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Quartier, rue, numéro de porte…"
                  style={{
                    width: "100%",
                    background: "#faf6f1",
                    border: "1px solid rgba(81,31,41,0.16)",
                    color: "#2a181d",
                    padding: "13px 14px",
                    fontSize: "14px",
                    borderRadius: "3px",
                    outline: "none",
                  }}
                />
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
              >
                <label style={{ display: "block" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "10.5px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#94786b",
                      marginBottom: "7px",
                    }}
                  >
                    Ville / Commune *
                  </span>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cocody, Abidjan"
                    required
                    style={{
                      width: "100%",
                      background: "#faf6f1",
                      border: "1px solid rgba(81,31,41,0.16)",
                      color: "#2a181d",
                      padding: "13px 14px",
                      fontSize: "14px",
                      borderRadius: "3px",
                      outline: "none",
                    }}
                  />
                </label>
                <label style={{ display: "block" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "10.5px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#94786b",
                      marginBottom: "7px",
                    }}
                  >
                    Pays
                  </span>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#faf6f1",
                      border: "1px solid rgba(81,31,41,0.16)",
                      color: "#2a181d",
                      padding: "13px 14px",
                      fontSize: "14px",
                      borderRadius: "3px",
                      outline: "none",
                    }}
                  >
                    <option>Côte d&apos;Ivoire</option>
                    <option>France</option>
                    <option>Sénégal</option>
                    <option>Mali</option>
                    <option>Autre</option>
                  </select>
                </label>
              </div>

              <label style={{ display: "block", marginTop: "15px" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "10.5px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#94786b",
                    marginBottom: "7px",
                  }}
                >
                  Instructions{" "}
                  <span
                    style={{
                      textTransform: "none",
                      letterSpacing: 0,
                      color: "#b09a8d",
                    }}
                  >
                    (optionnel)
                  </span>
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Point de repère, code d'entrée, taille, couleur…"
                  style={{
                    width: "100%",
                    background: "#faf6f1",
                    border: "1px solid rgba(81,31,41,0.16)",
                    color: "#2a181d",
                    padding: "13px 14px",
                    fontSize: "14px",
                    borderRadius: "3px",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </label>
            </div>

            {/* Shipping */}
            <div
              style={{
                background: "#fff",
                border: "1px solid rgba(81,31,41,0.1)",
                borderRadius: "5px",
                padding: "26px 28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "13px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "5px",
                    background: "#511F29",
                    color: "#fcd3b4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Truck size={17} strokeWidth={1.6} />
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "19px",
                      color: "#2a181d",
                      lineHeight: 1.1,
                    }}
                  >
                    Mode d&apos;expédition
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "#94786b", marginTop: "2px" }}
                  >
                    Choisissez votre zone de livraison
                  </div>
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                <button
                  type="button"
                  onClick={() => setShipping("abidjan")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    textAlign: "left",
                    background: "#faf6f1",
                    border: "1px solid rgba(81,31,41,0.16)",
                    borderRadius: "4px",
                    padding: "15px 17px",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "999px",
                      border: "1.5px solid #511F29",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {shipping === "abidjan" && (
                      <span
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "999px",
                          background: "#511F29",
                        }}
                      />
                    )}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#2a181d",
                        fontWeight: 600,
                      }}
                    >
                      Livraison ville Abidjan
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#94786b",
                        marginTop: "3px",
                      }}
                    >
                      du lundi au samedi, entre 14h et 20h
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#511F29",
                      whiteSpace: "nowrap",
                    }}
                  >
                    1 500 FCFA
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShipping("hors")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    textAlign: "left",
                    background: "#faf6f1",
                    border: "1px solid rgba(81,31,41,0.16)",
                    borderRadius: "4px",
                    padding: "15px 17px",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "999px",
                      border: "1.5px solid #511F29",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {shipping === "hors" && (
                      <span
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "999px",
                          background: "#511F29",
                        }}
                      />
                    )}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#2a181d",
                        fontWeight: 600,
                      }}
                    >
                      Livraison hors Abidjan
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#94786b",
                        marginTop: "3px",
                      }}
                    >
                      frais à régler avant le départ du livreur
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#511F29",
                      whiteSpace: "nowrap",
                    }}
                  >
                    3 000 FCFA
                  </span>
                </button>
              </div>
            </div>

            {/* Payment */}
            <div
              style={{
                background: "#fff",
                border: "1px solid rgba(81,31,41,0.1)",
                borderRadius: "5px",
                padding: "26px 28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "13px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "5px",
                    background: "#511F29",
                    color: "#fcd3b4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CreditCard size={17} strokeWidth={1.6} />
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "19px",
                      color: "#2a181d",
                      lineHeight: 1.1,
                    }}
                  >
                    Paiement
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "#94786b", marginTop: "2px" }}
                  >
                    Choisissez votre mode de paiement
                  </div>
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                <button
                  type="button"
                  onClick={() => setPayment("livraison")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    textAlign: "left",
                    background: "#faf6f1",
                    border: "1px solid rgba(81,31,41,0.16)",
                    borderRadius: "4px",
                    padding: "15px 17px",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "999px",
                      border: "1.5px solid #511F29",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {payment === "livraison" && (
                      <span
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "999px",
                          background: "#511F29",
                        }}
                      />
                    )}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#2a181d",
                        fontWeight: 600,
                      }}
                    >
                      Paiement à la livraison
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#94786b",
                        marginTop: "3px",
                      }}
                    >
                      Réglez en espèces à la réception de votre commande
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayment("momo")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    textAlign: "left",
                    background: "#faf6f1",
                    border: "1px solid rgba(81,31,41,0.16)",
                    borderRadius: "4px",
                    padding: "15px 17px",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "999px",
                      border: "1.5px solid #511F29",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {payment === "momo" && (
                      <span
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "999px",
                          background: "#511F29",
                        }}
                      />
                    )}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#2a181d",
                        fontWeight: 600,
                      }}
                    >
                      Mobile Money
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#94786b",
                        marginTop: "3px",
                      }}
                    >
                      Orange, MTN, Moov ou Wave — détails sur WhatsApp
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayment("virement")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    textAlign: "left",
                    background: "#faf6f1",
                    border: "1px solid rgba(81,31,41,0.16)",
                    borderRadius: "4px",
                    padding: "15px 17px",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "999px",
                      border: "1.5px solid #511F29",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {payment === "virement" && (
                      <span
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "999px",
                          background: "#511F29",
                        }}
                      />
                    )}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#2a181d",
                        fontWeight: 600,
                      }}
                    >
                      Virement bancaire
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#94786b",
                        marginTop: "3px",
                      }}
                    >
                      Coordonnées communiquées après confirmation
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "11px",
                background: isFormValid ? "#1f8a4c" : "#94786b",
                color: "#fff",
                border: "none",
                cursor: isFormValid ? "pointer" : "not-allowed",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "19px",
                borderRadius: "3px",
                transition: "all 0.25s",
              }}
            >
              <MessageCircle size={20} strokeWidth={1.6} />
              Confirmer — {formatPrice(total)}
            </button>

            {!isFormValid && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#b09a8d",
                  textAlign: "center",
                }}
              >
                Veuillez remplir tous les champs obligatoires (*)
              </p>
            )}
          </form>

          {/* Order Summary */}
          <div
            style={{
              position: "sticky",
              top: "90px",
              background: "#fff",
              border: "1px solid rgba(81,31,41,0.1)",
              borderRadius: "5px",
              padding: "26px 28px",
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "21px",
                color: "#2a181d",
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: "1px solid rgba(81,31,41,0.1)",
              }}
            >
              Récapitulatif
            </div>

            {/* Cart Items */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginBottom: "20px",
                paddingBottom: "20px",
                borderBottom: "1px solid rgba(81,31,41,0.1)",
              }}
            >
              {cartItems.map(({ product, quantity }) => {
                if (!product) return null;
                return (
                  <div
                    key={product.id}
                    style={{ display: "flex", gap: "14px" }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "75px",
                        flexShrink: 0,
                        overflow: "hidden",
                        borderRadius: "2px",
                        background: "#ece0d3",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{
                          objectFit: "cover",
                          objectPosition: "center 20%",
                        }}
                        sizes="60px"
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "-6px",
                          right: "-6px",
                          background: "#511F29",
                          color: "#fcd3b4",
                          fontSize: "9px",
                          fontWeight: 600,
                          width: "18px",
                          height: "18px",
                          borderRadius: "999px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {quantity}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "9px",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "#94786b",
                        }}
                      >
                        {product.category}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "14px",
                          color: "#2a181d",
                          marginTop: "2px",
                          lineHeight: 1.2,
                        }}
                      >
                        {product.name}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#511F29",
                          marginTop: "6px",
                        }}
                      >
                        {formatPrice(product.price * quantity)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: "#6e5a50" }}>Sous-total</span>
                <span style={{ color: "#2a181d" }}>{formatPrice(subtotal)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: "#6e5a50" }}>Livraison</span>
                <span style={{ color: "#2a181d" }}>
                  {formatPrice(shippingCost)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(81,31,41,0.1)",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "18px",
                    color: "#2a181d",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "22px",
                    fontWeight: 500,
                    color: "#511F29",
                  }}
                >
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
