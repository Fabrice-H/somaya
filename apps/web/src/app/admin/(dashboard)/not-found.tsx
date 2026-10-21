import Link from "next/link";
import { ErrorState } from "@/shared/components/ui/ErrorState";

export default function AdminNotFound() {
  return (
    <ErrorState
      compact
      code="404"
      title="Élément introuvable"
      text="Cet élément a peut-être été supprimé ou le lien est incorrect."
      actions={
        <Link href="/admin" className="btn-primary">
          Tableau de bord
        </Link>
      }
    />
  );
}
