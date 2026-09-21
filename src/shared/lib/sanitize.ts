import DOMPurify from "isomorphic-dompurify";

const RICH_TEXT_TAGS = ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "h2", "h3", "a", "blockquote"];

export function sanitizeRichText(html: string | null): string | null {
  if (!html) return null;
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: RICH_TEXT_TAGS, ALLOWED_ATTR: ["href", "target", "rel"] });
}

export function sanitizePlainText(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}
