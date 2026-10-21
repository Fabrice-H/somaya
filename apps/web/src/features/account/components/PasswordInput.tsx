"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & { id: string };

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="input-group-som">
      <input {...props} type={visible ? "text" : "password"} className="input-som pl-4!" />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="flex w-12 shrink-0 cursor-pointer items-center justify-center text-[var(--som-gray)] hover:text-[var(--som-ink)]"
      >
        {visible ? <EyeOff size={17} strokeWidth={1.5} aria-hidden /> : <Eye size={17} strokeWidth={1.5} aria-hidden />}
      </button>
    </div>
  );
}
