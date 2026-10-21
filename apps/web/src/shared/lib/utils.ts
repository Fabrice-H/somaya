export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export function getVisiblePages(page: number, totalPages: number): number[] {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  if (totalPages <= 7) return pages;
  return pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);
}
