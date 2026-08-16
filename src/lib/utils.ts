/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Format a price in XOF
 */
export function formatPriceXOF(price: number): string {
  return new Intl.NumberFormat("fr-CI", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(price) + " FCFA";
}
