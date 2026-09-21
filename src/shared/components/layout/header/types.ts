export type NavCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
};

export type HeaderPanel = "shop" | "search" | "mobile" | null;
