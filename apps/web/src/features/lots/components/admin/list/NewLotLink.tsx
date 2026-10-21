import Link from "next/link";
import { Plus } from "lucide-react";
import { ADMIN_LOTS_PATH } from "@/features/lots/constants";

export function NewLotLink({ className = "btn-primary btn-sm", label = "Nouveau lot" }) {
  return (
    <Link href={`${ADMIN_LOTS_PATH}/nouveau`} className={className}>
      <Plus size={16} strokeWidth={1.5} aria-hidden />
      {label}
    </Link>
  );
}
