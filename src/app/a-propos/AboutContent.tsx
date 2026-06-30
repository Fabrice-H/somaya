"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, Award, Heart, Sparkles, Users, Truck, Shield } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { createWhatsAppLink } from "@/data/products";

const values = [
  {
    icon: <Award className="w-8 h-8" />,
    title: "Qualité Premium",
    description:
      "Chaque article est soigneusement sélectionné pour sa qualité exceptionnelle et son élégance intemporelle. Nous ne faisons aucun compromis sur la qualité.",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Style Africain Moderne",
    description:
      "Nous célébrons la beauté et l'héritage de la femme africaine tout en embrassant les tendances contemporaines. Un mélange unique de tradition et modernité.",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Élégance Quotidienne",
    description:
      "Des pièces pour toutes les occasions - du bureau aux cérémonies. Parce que chaque femme mérite de se sentir belle chaque jour.",
  },
];

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Service Personnalisé",
    description: "Un accompagnement sur mesure pour trouver les pièces parfaites.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Livraison Abidjan",
    description: "Livraison rapide et soignée dans toute la ville d'Abidjan.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Qualité Garantie",
    description: "Tous nos produits sont vérifiés pour garantir votre satisfaction.",
  },
];

export function AboutContent() {
  const whatsappLink = createWhatsAppLink(
    "Bonjour, j'aimerais en savoir plus sur SO'MAYA et vos produits."
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(30px, 4vw, 50px) 40px 0",
        }}
      >
        <Breadcrumb items={[{ label: "À propos" }]} />
      </div>

      {/* Hero Section */}
      <section
        style={{
          padding: "clamp(40px, 6vw, 80px) 40px",
          background: "#faf6f1",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontSize: "11.5px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#94786b",
              marginBottom: "14px",
            }}
          >
            Notre Histoire
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              fontSize: "clamp(34px, 4vw, 56px)",
              lineHeight: 1.1,
              color: "#2a181d",
              margin: "0 0 20px",
            }}
          >
            Bienvenue chez SO&apos;MAYA
          </h1>
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              color: "#6e5a50",
              margin: 0,
            }}
          >
            Votre boutique de référence pour sublimer votre style au quotidien.
            Découvrez notre passion pour la mode féminine africaine.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/about-story.jpg"
                  alt="L'histoire de SO'MAYA"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-[var(--burgundy)]/20 -z-10" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[var(--burgundy)] uppercase tracking-[0.2em] text-sm font-medium mb-4">
                Qui Sommes-Nous
              </p>
              <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-3xl md:text-4xl text-[var(--charcoal)] font-light mb-8">
                Une Passion pour l&apos;Élégance
              </h2>
              <div className="space-y-5 text-[var(--charcoal)]/70 text-lg leading-relaxed">
                <p>
                  Chez SO&apos;MAYA, nous croyons que chaque femme mérite de se sentir
                  belle et confiante. C&apos;est pourquoi nous avons créé une collection
                  unique d&apos;articles de mode et d&apos;accessoires soigneusement
                  sélectionnés.
                </p>
                <p>
                  Notre mission est simple : vous offrir des pièces de qualité
                  qui subliment votre style au quotidien, que ce soit pour une
                  journée au bureau, une sortie entre amies ou une cérémonie
                  spéciale.
                </p>
                <p>
                  Basée à Abidjan, notre boutique s&apos;inspire de l&apos;élégance africaine
                  moderne tout en restant accessible. Chaque bijou, sac, tunique
                  ou accessoire que nous proposons est choisi avec soin pour
                  répondre aux attentes des femmes exigeantes.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 bg-[var(--burgundy)] text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[var(--peach)] uppercase tracking-[0.2em] text-sm font-medium mb-4">
              Nos Valeurs
            </p>
            <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-3xl md:text-4xl text-white font-light">
              Ce Qui Nous Définit
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/10 flex items-center justify-center text-[var(--peach)] mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-xl text-[var(--peach)] mb-4">
                  {value.title}
                </h3>
                <p className="text-white/70 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[var(--burgundy)] uppercase tracking-[0.2em] text-sm font-medium mb-4">
              Pourquoi Nous Choisir
            </p>
            <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-3xl md:text-4xl text-[var(--charcoal)] font-light">
              L&apos;Expérience SO&apos;MAYA
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8"
              >
                <div className="w-12 h-12 bg-[var(--peach)]/30 flex items-center justify-center text-[var(--burgundy)] mb-5">
                  {feature.icon}
                </div>
                <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-lg text-[var(--charcoal)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--charcoal)]/60 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[var(--burgundy)] uppercase tracking-[0.2em] text-sm font-medium mb-4">
              Contactez-Nous
            </p>
            <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-3xl md:text-4xl text-[var(--charcoal)] font-light mb-6">
              Prête à Sublimer Votre Style ?
            </h2>
            <p className="text-[var(--charcoal)]/70 text-lg mb-10">
              N&apos;hésitez pas à nous contacter pour toute question ou pour
              découvrir nos dernières nouveautés. Notre équipe est là pour vous
              accompagner.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-3 text-base py-4 px-8"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Discuter sur WhatsApp</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
