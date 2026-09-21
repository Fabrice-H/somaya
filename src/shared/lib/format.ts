const priceFormatter = new Intl.NumberFormat("fr-CI", { style: "decimal", minimumFractionDigits: 0 });

export function formatPrice(value: number | string): string {
  return `${priceFormatter.format(Number(value))} FCFA`;
}
