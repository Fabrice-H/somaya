export function sanitizePlainText(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}
