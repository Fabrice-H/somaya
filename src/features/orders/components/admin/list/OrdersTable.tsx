"use client";

import { useRouter } from "next/navigation";
import { Table, Th } from "@/shared/components/admin/ui/Table";
import type { OrderSummary } from "../../../types";
import { OrderMobileRow, OrderRow } from "./OrderRow";

export function OrdersTable({ orders }: { orders: OrderSummary[] }) {
  const router = useRouter();

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <thead>
            <tr>
              <Th>Commande</Th>
              <Th>Client</Th>
              <Th>Date</Th>
              <Th>Paiement</Th>
              <Th>Statut</Th>
              <Th align="right">Total</Th>
              <Th>
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} onOpen={(href) => router.push(href)} />
            ))}
          </tbody>
        </Table>
      </div>
      <div className="md:hidden">
        {orders.map((order) => (
          <OrderMobileRow key={order.id} order={order} />
        ))}
      </div>
    </>
  );
}
