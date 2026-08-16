import { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | SO'MAYA",
  description:
    "Découvrez comment SO'MAYA protège vos données personnelles et respecte votre vie privée.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <HeaderWrapper />
      <main>
        <LegalPageLayout
          title="Politique de Confidentialité"
          lastUpdated="16 Août 2026"
        >
          <h2>1. Introduction</h2>
          <p>
            Chez SO&apos;MAYA, nous accordons une grande importance à la protection de vos données personnelles.
            Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons
            vos informations lorsque vous visitez notre site web ou effectuez des achats.
          </p>

          <h2>2. Données collectées</h2>
          <p>Nous collectons les informations suivantes :</p>
          <ul>
            <li><strong>Informations d&apos;identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
            <li><strong>Informations de livraison :</strong> adresse postale, commune, ville</li>
            <li><strong>Informations de commande :</strong> produits commandés, historique d&apos;achats</li>
            <li><strong>Données de navigation :</strong> pages visitées, durée de visite</li>
          </ul>

          <h2>3. Utilisation des données</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul>
            <li>Traiter et livrer vos commandes</li>
            <li>Vous contacter concernant vos commandes via WhatsApp ou téléphone</li>
            <li>Améliorer notre site web et nos services</li>
            <li>Vous envoyer des informations sur nos nouvelles collections (avec votre consentement)</li>
          </ul>

          <h2>4. Partage des données</h2>
          <p>
            Nous ne vendons jamais vos données personnelles à des tiers. Vos informations peuvent être
            partagées uniquement avec :
          </p>
          <ul>
            <li>Nos partenaires de livraison pour acheminer vos commandes</li>
            <li>Les autorités compétentes si la loi l&apos;exige</li>
          </ul>

          <h2>5. Protection des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre
            tout accès non autorisé, modification, divulgation ou destruction. Notre site utilise le
            protocole HTTPS pour sécuriser vos échanges.
          </p>

          <h2>6. Vos droits</h2>
          <p>Conformément à la réglementation en vigueur, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données personnelles</li>
            <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
            <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données</li>
            <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous via WhatsApp au +225 05 08 90 56 66
            ou par téléphone au +225 07 78 78 42 68.
          </p>

          <h2>7. Cookies</h2>
          <p>
            Notre site utilise des cookies essentiels pour assurer son bon fonctionnement.
            Ces cookies permettent de mémoriser votre panier et vos préférences de navigation.
          </p>

          <h2>8. Modifications</h2>
          <p>
            Nous pouvons mettre à jour cette politique de confidentialité occasionnellement.
            La date de dernière mise à jour est indiquée en haut de cette page.
          </p>

          <h2>9. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité, contactez-nous :
          </p>
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
