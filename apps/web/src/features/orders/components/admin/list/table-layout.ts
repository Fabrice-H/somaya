export const ORDERS_GRID_COLUMNS = "120px 1fr 140px 120px 100px 90px 60px";

export const ORDERS_TABLE_COLUMNS = [
  { label: "N° Commande" },
  { label: "Client" },
  { label: "Date" },
  { label: "Total", align: "right" },
  { label: "Paiement" },
  { label: "Statut" },
] as const;
