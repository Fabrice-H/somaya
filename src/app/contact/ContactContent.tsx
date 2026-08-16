"use client";

import { MapPin, Phone, MessageCircle, Clock, ArrowUpRight } from "lucide-react";
import type { StoreSettings } from "@/features/admin/settings/actions";

interface Props {
  settings: StoreSettings | null;
}

export function ContactContent({ settings }: Props) {
  const phone = settings?.phone_number || "+225 07 78 78 42 68";
  const whatsapp = settings?.whatsapp_number || "+225 05 08 90 56 66";
  const address = settings?.address || "Angré Château\nNon loin du Collège International les Vallées d'Angré\n08 BP 2190 Abj 08";
  const instagram = settings?.instagram_handle || "so_maya_ci";
  const facebook = settings?.facebook_url || "https://www.facebook.com/MadeyaCado";
  const tiktok = settings?.tiktok_handle || "somayashop";
  const deliveryHours = settings?.delivery_hours || "Lun - Sam : 9h00 - 19h00\nDimanche : Fermé";

  const phoneUrl = phone.replace(/\s/g, "");
  const whatsappClean = whatsapp.replace(/\s/g, "").replace(/^\+/, "");

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Hero */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-24 px-5 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#511F29]/60 mb-4">
            Contact
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-[#2a181d] mb-6">
            Parlons ensemble
          </h1>
          <p className="text-base md:text-lg text-[#511F29]/70 leading-relaxed max-w-xl mx-auto">
            Une question, une commande ou simplement envie de nous dire bonjour ?
            On est là pour vous.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-5 md:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              {/* Address Card */}
              <div className="bg-white p-8 border border-[#511F29]/10">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#fcd3b4]/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#511F29]" />
                  </div>
                  <div>
                    <h3 className="text-xs tracking-[0.15em] uppercase text-[#511F29]/60 mb-3">
                      Adresse
                    </h3>
                    <p className="text-[15px] leading-relaxed text-[#2a181d]">
                      {address.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < address.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-white p-8 border border-[#511F29]/10">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#fcd3b4]/30 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#511F29]" />
                  </div>
                  <div>
                    <h3 className="text-xs tracking-[0.15em] uppercase text-[#511F29]/60 mb-3">
                      Horaires
                    </h3>
                    <p className="text-[15px] leading-relaxed text-[#2a181d]">
                      {deliveryHours.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < deliveryHours.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Phone */}
                <a
                  href={`tel:${phoneUrl}`}
                  className="group bg-white p-6 border border-[#511F29]/10 hover:border-[#511F29]/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Phone className="w-5 h-5 text-[#511F29]/70" />
                    <ArrowUpRight className="w-4 h-4 text-[#511F29]/40 group-hover:text-[#511F29] transition-colors" />
                  </div>
                  <p className="text-xs tracking-[0.15em] uppercase text-[#511F29]/60 mb-1">
                    Téléphone
                  </p>
                  <p className="text-[15px] text-[#2a181d] font-medium">
                    {phone}
                  </p>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${whatsappClean}?text=Bonjour%20SO'MAYA%20!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#511F29] p-6 hover:bg-[#3d171f] transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <MessageCircle className="w-5 h-5 text-white" />
                    <ArrowUpRight className="w-4 h-4 text-[#fcd3b4]/70 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs tracking-[0.15em] uppercase text-[#fcd3b4]/80 mb-1">
                    WhatsApp
                  </p>
                  <p className="text-[15px] text-white font-medium">
                    {whatsapp}
                  </p>
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="h-[400px] lg:h-auto lg:min-h-[500px] bg-[#fcd3b4]/20 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.9631550495205!2d-3.9620294!3d5.4225692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1930016d4bcdf%3A0x566d63be49c7de8d!2sSO'MAYA!5e0!3m2!1sfr!2sci!4v1785570866631!5m2!1sfr!2sci"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Localisation SO'MAYA"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Section */}
      <section className="py-16 md:py-24 px-5 md:px-8 bg-white border-t border-[#511F29]/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#511F29]/60 mb-4">
            Réseaux sociaux
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#2a181d] mb-12">
            Suivez-nous
          </h2>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {instagram && (
              <a
                href={`https://www.instagram.com/${instagram}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-[#511F29]/20 text-sm tracking-[0.1em] uppercase text-[#511F29] hover:bg-[#511F29] hover:text-white hover:border-[#511F29] transition-all"
              >
                Instagram
              </a>
            )}
            {tiktok && (
              <a
                href={`https://www.tiktok.com/@${tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-[#511F29]/20 text-sm tracking-[0.1em] uppercase text-[#511F29] hover:bg-[#511F29] hover:text-white hover:border-[#511F29] transition-all"
              >
                TikTok
              </a>
            )}
            {facebook && (
              <a
                href={facebook.startsWith("http") ? facebook : `https://www.facebook.com/${facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-[#511F29]/20 text-sm tracking-[0.1em] uppercase text-[#511F29] hover:bg-[#511F29] hover:text-white hover:border-[#511F29] transition-all"
              >
                Facebook
              </a>
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 px-5 md:px-8 bg-[#511F29]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-serif text-xl md:text-2xl text-white text-center md:text-left">
            Une question ? On vous répond rapidement.
          </p>
          <a
            href={`https://wa.me/${whatsappClean}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#fcd3b4] text-[#511F29] text-sm font-medium tracking-wide hover:bg-white transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Écrire sur WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
