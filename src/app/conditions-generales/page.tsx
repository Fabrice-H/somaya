import { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente | SO'MAYA",
  description:
    "Consultez les conditions générales de vente de SO'MAYA pour vos achats en ligne.",
};

export default function ConditionsGeneralesPage() {
  return (
    <>
      <HeaderWrapper />
      <main>
        <LegalPageLayout
          title="Conditions Générales de Vente"
          lastUpdated="16 Août 2026"
        >
          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits
            effectuées par SO&apos;MAYA, boutique de prêt-à-porter située à Abidjan, Côte d&apos;Ivoire.
            Toute commande implique l&apos;acceptation sans réserve de ces CGV.
          </p>

          <h2>2. Produits</h2>
          <p>
            Les produits proposés à la vente sont ceux présentés sur notre site web et disponibles
            dans la limite des stocks. Les photographies et descriptions sont aussi fidèles que possible
            mais ne peuvent assurer une similitude parfaite avec le produit.
          </p>

          <h2>3. Prix</h2>
          <p>
            Les prix sont indiqués en Francs CFA (FCFA) et incluent toutes les taxes applicables.
            Les frais de livraison sont ajoutés au montant de la commande et indiqués avant validation.
            SO&apos;MAYA se réserve le droit de modifier ses prix à tout moment, les produits étant
            facturés au prix en vigueur au moment de la commande.
          </p>

          <h2>4. Commande</h2>
          <h3>4.1 Processus de commande</h3>
          <p>
            Les commandes sont passées via WhatsApp ou directement en boutique. Pour valider votre commande :
          </p>
          <ul>
            <li>Sélectionnez vos articles et ajoutez-les au panier</li>
            <li>Renseignez vos informations de livraison</li>
            <li>Confirmez votre commande via WhatsApp</li>
            <li>Effectuez le paiement selon la méthode choisie</li>
          </ul>

          <h3>4.2 Confirmation</h3>
          <p>
            Une confirmation de commande vous sera envoyée par WhatsApp avec le récapitulatif
            de votre commande et les instructions de paiement.
          </p>

          <h2>5. Paiement</h2>
          <p>Nous acceptons les modes de paiement suivants :</p>
          <ul>
            <li>Paiement à la livraison (Abidjan uniquement)</li>
            <li>Mobile Money (Orange Money, MTN Mobile Money, Wave)</li>
            <li>Virement bancaire</li>
          </ul>
          <p>
            La commande est expédiée après réception du paiement ou confirmée pour paiement
            à la livraison.
          </p>

          <h2>6. Livraison</h2>
          <p>
            Les livraisons sont effectuées dans tout Abidjan. Les délais et tarifs de livraison
            sont précisés sur notre page <a href="/livraison-retours">Livraison & Retours</a>.
          </p>

          <h2>7. Droit de rétractation</h2>
          <p>
            Vous disposez d&apos;un délai de 48 heures après réception pour retourner un article
            non porté, avec étiquettes, dans son emballage d&apos;origine. Contactez-nous par WhatsApp
            pour organiser le retour.
          </p>

          <h2>8. Garantie</h2>
          <p>
            Tous nos produits bénéficient de la garantie légale de conformité. Si vous constatez
            un défaut, contactez-nous dans les 7 jours suivant la réception.
          </p>

          <h2>9. Responsabilité</h2>
          <p>
            SO&apos;MAYA ne saurait être tenue responsable des dommages résultant d&apos;une mauvaise
            utilisation des produits ou du non-respect des instructions d&apos;entretien.
          </p>

          <h2>10. Propriété intellectuelle</h2>
          <p>
            Tous les éléments du site (textes, images, logos) sont la propriété exclusive de SO&apos;MAYA.
            Toute reproduction est interdite sans autorisation préalable.
          </p>

          <h2>11. Litiges</h2>
          <p>
            En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.
            Les présentes CGV sont soumises au droit ivoirien.
          </p>

          <h2>12. Contact</h2>
          <p>Pour toute question :</p>
          <ul>
            <li>WhatsApp : +225 05 08 90 56 66</li>
            <li>Téléphone : +225 07 78 78 42 68</li>
            <li>Adresse : Angré Château, Abidjan, Côte d&apos;Ivoire</li>
          </ul>
        </LegalPageLayout>
      </main>
      <Footer />
    </>
  );
}
