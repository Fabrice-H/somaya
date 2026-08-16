"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  MessageCircle,
  ChevronDown,
  Truck,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { createOrder } from "@/features/admin/orders/actions";

function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("fr-CI", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(price) + " FCFA"
  );
}

const WHATSAPP_NUMBER = "2250508905666";

const COMMUNES_ABIDJAN = [
  "Abobo",
  "Adjamé",
  "Anyama",
  "Attécoubé",
  "Bingerville",
  "Cocody",
  "Koumassi",
  "Marcory",
  "Plateau",
  "Port-Bouët",
  "Songon",
  "Treichville",
  "Yopougon",
];

export function CheckoutContent() {
  const router = useRouter();
  const { getItemCount, getSubtotal, clearCart, getItems } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [commune, setCommune] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItems = getItems();
  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const hasItems = cartItems.length > 0;

  const shippingCost = 1500;
  const total = subtotal + shippingCost;

  const isFormValid = firstName && lastName && phone && commune;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare order items for database
      const orderItems = cartItems.map((item) => {
        const displayPrice = item.lotPrice ?? item.price;
        return {
          product_id: item.lotId ? null : item.productId,
          product_name: item.productName,
          product_price: displayPrice,
          product_image: item.productImage || null,
          quantity: item.quantity,
          lot_id: item.lotId || null,
          lot_name: item.lotName || null,
          line_total: displayPrice * item.quantity,
        };
      });

      console.log("Order items prepared:", orderItems);

      // Create order in database
      const orderData = {
        customer_first_name: firstName,
        customer_last_name: lastName,
        customer_phone: phone,
        customer_address: address || "",
        customer_commune: commune,
        customer_notes: notes || undefined,
        payment_method: "cash" as const,
        subtotal,
        delivery_fee: shippingCost,
        total,
        items: orderItems,
      };

      console.log("Creating order with data:", orderData);

      const result = await createOrder(orderData);

      console.log("Order creation result:", result);

      if (!result.success) {
        setError(result.error || "Erreur lors de la commande");
        setIsSubmitting(false);
        return;
      }

      // Build WhatsApp message
      const itemsList = cartItems
        .map((item) => {
          const displayName = item.lotName
            ? `${item.productName} - ${item.lotName}`
            : item.productName;
          const displayPrice = item.lotPrice ?? item.price;
          return `• ${displayName} x${item.quantity} - ${formatPrice(displayPrice * item.quantity)}`;
        })
        .join("\n");

      const message = `
🛍️ *NOUVELLE COMMANDE SO'MAYA*
📋 N° ${result.order_number}

👤 *Client*
${firstName} ${lastName}
📞 +225 ${phone}

📍 *Livraison*
${address ? `${address}\n` : ""}${commune}, Abidjan
${notes ? `\n📝 Note: ${notes}` : ""}

🛒 *Articles*
${itemsList}

📦 Livraison: ${formatPrice(shippingCost)}
💰 *TOTAL: ${formatPrice(total)}*
      `.trim();

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      clearCart();
      window.open(whatsappUrl, "_blank");
      router.push("/");
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  // Empty cart state
  if (!hasItems) {
    return (
      <div className="min-h-screen bg-[#faf6f1] flex flex-col items-center justify-center px-6 py-20">
        <div className="w-20 h-20 bg-[#fcd3b4]/30 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-10 h-10 text-[#511F29]/50" strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-3xl text-[#2a181d] mb-3">
          Votre panier est vide
        </h1>
        <p className="text-[#511F29]/60 mb-10 text-center max-w-sm">
          Découvrez nos collections et trouvez la pièce parfaite pour sublimer votre style.
        </p>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 bg-[#511F29] text-white px-8 py-4 text-sm font-medium tracking-wide hover:bg-[#3d171f] transition-colors"
        >
          Découvrir la collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Header */}
      <header className="bg-white border-b border-[#511F29]/10">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/catalogue" className="inline-flex items-center gap-2 text-sm text-[#511F29]/70 hover:text-[#511F29] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <Link href="/">
            <Image
              src="/images/logo_header.png"
              alt="SO'MAYA"
              width={100}
              height={25}
              className="h-6 w-auto"
            />
          </Link>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-10 lg:py-16">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-16">
          {/* Left Column - Form */}
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl text-[#2a181d] mb-2">
              Finaliser la commande
            </h1>
            <p className="text-[#511F29]/60 mb-10">
              Renseignez vos informations pour recevoir votre colis
            </p>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Section */}
              <section>
                <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-[#511F29]/60 mb-5">
                  Vos coordonnées
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#2a181d] mb-2">Prénom</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Marie"
                        required
                        className="w-full h-12 px-4 bg-white border border-[#511F29]/20 text-[#2a181d] text-[15px] outline-none transition-colors focus:border-[#511F29] placeholder:text-[#511F29]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#2a181d] mb-2">Nom</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Koné"
                        required
                        className="w-full h-12 px-4 bg-white border border-[#511F29]/20 text-[#2a181d] text-[15px] outline-none transition-colors focus:border-[#511F29] placeholder:text-[#511F29]/40"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#2a181d] mb-2">Téléphone</label>
                    <div className="flex h-12 bg-white border border-[#511F29]/20 focus-within:border-[#511F29] transition-colors">
                      <span className="flex items-center gap-2 px-4 bg-[#fcd3b4]/30 border-r border-[#511F29]/20 text-[#511F29]/70 text-sm">
                        🇨🇮 +225
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07 00 00 00 00"
                        required
                        className="flex-1 h-full px-4 bg-transparent text-[#2a181d] text-[15px] outline-none placeholder:text-[#511F29]/40"
                      />
                      {phone.length >= 10 && (
                        <span className="flex items-center pr-4 text-[#511F29]">
                          <Check className="w-5 h-5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Delivery Section */}
              <section>
                <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-[#511F29]/60 mb-5">
                  Adresse de livraison
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#2a181d] mb-2">Commune</label>
                    <div className="relative">
                      <select
                        value={commune}
                        onChange={(e) => setCommune(e.target.value)}
                        required
                        className="w-full h-12 px-4 bg-white border border-[#511F29]/20 text-[#2a181d] text-[15px] outline-none transition-colors focus:border-[#511F29] appearance-none cursor-pointer"
                      >
                        <option value="" className="text-[#511F29]/40">Sélectionner une commune</option>
                        {COMMUNES_ABIDJAN.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#511F29]/40 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#2a181d] mb-2">
                      Adresse complète <span className="text-[#511F29]/40">(optionnel)</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Quartier, rue, repère..."
                      className="w-full h-12 px-4 bg-white border border-[#511F29]/20 text-[#2a181d] text-[15px] outline-none transition-colors focus:border-[#511F29] placeholder:text-[#511F29]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#2a181d] mb-2">
                      Instructions <span className="text-[#511F29]/40">(optionnel)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="Instructions pour la livraison..."
                      className="w-full px-4 py-3 bg-white border border-[#511F29]/20 text-[#2a181d] text-[15px] outline-none transition-colors focus:border-[#511F29] placeholder:text-[#511F29]/40 resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Info */}
              <section className="bg-white border border-[#511F29]/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#fcd3b4]/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-[#511F29]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#2a181d] mb-1">
                      Paiement à la livraison
                    </h3>
                    <p className="text-sm text-[#511F29]/60">
                      Vous payez uniquement lorsque vous recevez votre commande. Nous vous appellerons avant la livraison.
                    </p>
                  </div>
                </div>
              </section>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded">
                  {error}
                </div>
              )}

              {/* Submit - Mobile */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full h-14 flex items-center justify-center gap-3 bg-[#511F29] text-white text-sm font-medium tracking-wide transition-all disabled:bg-[#511F29]/30 disabled:cursor-not-allowed hover:bg-[#3d171f]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      {isFormValid ? `Commander via WhatsApp` : "Remplissez le formulaire"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white border border-[#511F29]/10">
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#511F29]/10">
                <h2 className="text-sm font-medium tracking-[0.1em] uppercase text-[#2a181d]">
                  Récapitulatif
                </h2>
              </div>

              {/* Items */}
              <div className="px-6 py-5 space-y-5 border-b border-[#511F29]/10 max-h-[300px] overflow-y-auto">
                {cartItems.map((item) => {
                  const uniqueKey = item.lotId
                    ? `${item.productId}:${item.lotId}`
                    : item.productId;
                  const displayName = item.lotName
                    ? `${item.productName} - ${item.lotName}`
                    : item.productName;
                  const displayPrice = item.lotPrice ?? item.price;

                  return (
                    <div key={uniqueKey} className="flex gap-4">
                      <div className="relative w-16 h-20 flex-shrink-0 bg-[#fcd3b4]/20">
                        <Image
                          src={item.productImage}
                          alt={displayName}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#511F29] text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#2a181d] font-medium leading-snug line-clamp-2">
                          {displayName}
                        </p>
                        <p className="text-xs text-[#511F29]/50 mt-1">{item.categoryName}</p>
                        <p className="text-sm font-medium text-[#511F29] mt-2">
                          {formatPrice(displayPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="px-6 py-5 space-y-3 border-b border-[#511F29]/10">
                <div className="flex justify-between text-sm">
                  <span className="text-[#511F29]/60">Sous-total</span>
                  <span className="text-[#2a181d]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#511F29]/60">Livraison</span>
                  <span className="text-[#2a181d]">{formatPrice(shippingCost)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="px-6 py-5">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-[#2a181d]">Total</span>
                  <span className="text-xl font-semibold text-[#511F29]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Submit - Desktop */}
              <div className="px-6 pb-6 hidden lg:block">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full h-14 flex items-center justify-center gap-3 bg-[#511F29] text-white text-sm font-medium tracking-wide transition-all disabled:bg-[#511F29]/30 disabled:cursor-not-allowed hover:bg-[#3d171f]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      Commander via WhatsApp
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm text-[#511F29]/70">
                <Truck className="w-5 h-5 text-[#511F29]/50" />
                <span>Livraison Abidjan</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#511F29]/70">
                <ShieldCheck className="w-5 h-5 text-[#511F29]/50" />
                <span>Paiement sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
