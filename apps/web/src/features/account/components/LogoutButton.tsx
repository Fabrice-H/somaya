"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { customerLogoutAction } from "../server/actions";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      onClick={() => startTransition(() => customerLogoutAction())}
      disabled={isPending}
      className="btn-link disabled:opacity-60"
    >
      <LogOut size={15} strokeWidth={1.5} aria-hidden />
      {isPending ? "Déconnexion…" : "Me déconnecter"}
    </button>
  );
}
