const priceFormatter = new Intl.NumberFormat("fr-CI", { style: "decimal", minimumFractionDigits: 0 });

export function formatPrice(value: number | string): string {
  return `${priceFormatter.format(Number(value))} FCFA`;
}

const shortDateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const longDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatDate = (value: string | Date) => shortDateFormatter.format(new Date(value));

export const formatDateTime = (value: string | Date) => longDateFormatter.format(new Date(value));

export function formatRelativeDays(value: string | Date | null, now = new Date()): string {
  if (!value) return "Jamais";
  const days = Math.floor((now.getTime() - new Date(value).getTime()) / 86_400_000);
  if (days <= 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 30) return `Il y a ${days} jours`;
  if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`;
  return `Il y a ${Math.floor(days / 365)} an${days >= 730 ? "s" : ""}`;
}
