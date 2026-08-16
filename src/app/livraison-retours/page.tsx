import { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Livraison & Retours | SO'MAYA",
  description:
    "Informations sur la livraison et les retours chez SO'MAYA. Livraison rapide à Abidjan.",
};

export default function LivraisonRetoursPage() {
  return (
    <>
      <HeaderWrapper />
      <main>
        <LegalPageLayout
          title="Livraison & Retours"
          lastUpdated="16 Août 2026"
        >
          <h2>Livraison</h2>

          <h3>Zones de livraison</h3>
          <p>
            Nous livrons actuellement dans toutes les communes d&apos;Abidjan et ses environs.
            Pour les livraisons hors Abidjan, contactez-nous via WhatsApp pour un devis personnalisé.
          </p>

          <h3>Délais de livraison</h3>
          <ul>
            <li><strong>Abidjan :</strong> 24 à 48 heures ouvrées</li>
            <li><strong>Banlieue :</strong> 48 à 72 heures ouvrées</li>
          </ul>
          <p>
            Les délais sont indicatifs et peuvent varier selon la disponibilité des produits
            et les conditions de circulation.
          </p>

          <h3>Frais de livraison</h3>
          <ul>
            <li><strong>Cocody, Plateau, Marcory :</strong> 1 500 FCFA</li>
            <li><strong>Yopougon, Abobo, Adjamé :</strong> 2 000 FCFA</li>
            <li><strong>Autres communes :</strong> 2 500 FCFA</li>
            <li><strong>Livraison gratuite</strong> pour les commandes supérieures à 50 000 FCFA</li>
          </ul>

          <h3>Suivi de commande</h3>
          <p>
            Une fois votre commande expédiée, vous recevrez un message WhatsApp avec les
            informations de suivi. Notre livreur vous contactera avant son arrivée.
          </p>

          <h2>Retrait en boutique</h2>
          <p>
            Vous pouvez également retirer votre commande gratuitement à notre boutique :
          </p>
          <p>
            <strong>Adresse :</strong> Angré Château, non loin du Collège International les Vallées d&apos;Angré<br />
            <strong>Horaires :</strong> Lundi au Samedi, 9h00 - 19h00
          </p>

          <h2>Retours</h2>

          <h3>Conditions de retour</h3>
          <p>Nous acceptons les retours sous les conditions suivantes :</p>
          <ul>
            <li>L&apos;article doit être retourné dans les <strong>48 heures</strong> suivant la réception</li>
            <li>L&apos;article ne doit pas avoir été porté, lavé ou altéré</li>
            <li>Les étiquettes doivent être intactes</li>
            <li>L&apos;article doit être dans son emballage d&apos;origine</li>
          </ul>

          <h3>Articles non retournables</h3>
          <ul>
            <li>Sous-vêtements et maillots de bain (pour raisons d&apos;hygiène)</li>
            <li>Articles soldés ou en promotion</li>
            <li>Articles personnalisés ou sur mesure</li>
            <li>Accessoires (bijoux, foulards) avec scellé ouvert</li>
          </ul>

          <h3>Procédure de retour</h3>
          <ol>
            <li>Contactez-nous via WhatsApp au +225 05 08 90 56 66</li>
            <li>Expliquez la raison du retour et envoyez des photos si nécessaire</li>
            <li>Attendez notre confirmation et les instructions de retour</li>
            <li>Déposez l&apos;article en boutique ou organisez un enlèvement</li>
          </ol>

          <h3>Remboursement</h3>
          <p>
            Après vérification de l&apos;article retourné, le remboursement sera effectué sous 7 jours ouvrés
            via le même mode de paiement utilisé lors de l&apos;achat. Les frais de livraison initiaux
            ne sont pas remboursés.
          </p>

          <h3>Échange</h3>
          <p>
            Vous souhaitez échanger votre article contre une autre taille ou un autre coloris ?
            Contactez-nous via WhatsApp et nous organiserons l&apos;échange dans les meilleurs délais,
            sous réserve de disponibilité.
          </p>

          <h2>Articles défectueux</h2>
          <p>
            Si vous recevez un article défectueux ou endommagé, contactez-nous immédiatement
            avec des photos. Nous vous proposerons un échange ou un remboursement intégral,
            frais de livraison inclus.
          </p>

          <h2>Contact</h2>
          <p>Pour toute question sur la livraison ou les retours :</p>
          <ul>
            <li><strong>WhatsApp :</strong> +225 05 08 90 56 66</li>
            <li><strong>Téléphone :</strong> +225 07 78 78 42 68</li>
          </ul>
        </LegalPageLayout>
      </main>
      <Footer />
    </>
  );
}
