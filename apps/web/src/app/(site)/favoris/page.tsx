import type { Metadata } from "next";
import { WishlistContent } from "@/features/wishlist/components/WishlistContent";

export const metadata: Metadata = {
  title: "Mes favoris | SO'MAYA",
  description: "Retrouvez les pièces SO'MAYA que vous avez mises en favoris.",
  robots: { index: false },
};

export default function WishlistPage() {
  return <WishlistContent />;
}
