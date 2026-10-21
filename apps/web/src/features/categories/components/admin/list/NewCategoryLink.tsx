import Link from "next/link";
import { Plus } from "lucide-react";
import { ADMIN_CATEGORIES_PATH } from "@/features/categories/constants";

export function NewCategoryLink({ className = "btn-primary btn-sm" }: { className?: string }) {
  return (
    <Link href={`${ADMIN_CATEGORIES_PATH}/nouveau`} className={className}>
      <Plus size={16} strokeWidth={1.5} aria-hidden />
      Nouvelle catégorie
    </Link>
  );
}
