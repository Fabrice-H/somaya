import "server-only";
import sanitizeHtml from "sanitize-html";

const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "h2", "h3", "a", "blockquote"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
};

export function sanitizeRichText(html: string | null): string | null {
  if (!html) return null;
  return sanitizeHtml(html, RICH_TEXT_OPTIONS);
}
