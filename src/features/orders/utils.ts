export function generateOrderNumber(date = new Date()): string {
  const stamp = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SM-${stamp}-${random}`;
}
