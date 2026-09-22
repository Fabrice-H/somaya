import { MessageCircle } from "lucide-react";
import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { StatCard } from "@/shared/components/admin/ui/StatCard";
import { formatPrice, formatRelativeDays } from "@/shared/lib/format";
import { whatsappHref } from "@/shared/lib/phone";
import { CUSTOMERS_PATH } from "../../../constants";
import type { CustomerDetail } from "../../../types";
import { CustomerLoyaltyCard } from "./CustomerLoyaltyCard";
import { CustomerNotesCard } from "./CustomerNotesCard";
import { CustomerOrdersCard } from "./CustomerOrdersCard";
import { CustomerProfileCard } from "./CustomerProfileCard";
import { CustomerTopProductsCard } from "./CustomerTopProductsCard";

export function CustomerDetailView({ customer }: { customer: CustomerDetail }) {
  return (
    <AdminPage
      eyebrow="Client"
      title={customer.full_name}
      description={`Client depuis le ${new Date(customer.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`}
      back={{ href: CUSTOMERS_PATH, label: "Retour aux clients" }}
      actions={
        <a
          href={whatsappHref(customer.phone, `Bonjour ${customer.first_name}, `)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary btn-sm"
        >
          <MessageCircle size={15} strokeWidth={1.5} aria-hidden />
          Écrire sur WhatsApp
        </a>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Commandes" value={customer.orders_count} hint="Hors annulées" />
        <StatCard
          label="Total dépensé"
          value={formatPrice(customer.total_spent)}
          hint="Commandes livrées"
          tone="primary"
        />
        <StatCard
          label="Panier moyen"
          value={formatPrice(Math.round(customer.average_order))}
          hint="Par commande livrée"
        />
        <StatCard
          label="Dernière commande"
          value={formatRelativeDays(customer.last_order_at)}
          hint={customer.first_order_at ? `Première : ${formatRelativeDays(customer.first_order_at)}` : undefined}
        />
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CustomerOrdersCard orders={customer.orders} />
          <CustomerTopProductsCard products={customer.top_products} />
        </div>
        <div className="space-y-6">
          <CustomerProfileCard customer={customer} />
          <CustomerLoyaltyCard customer={customer} />
          <CustomerNotesCard customerId={customer.id} notes={customer.notes} />
        </div>
      </div>
    </AdminPage>
  );
}
