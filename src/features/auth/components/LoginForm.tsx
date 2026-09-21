"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction } from "../server/actions";
import type { LoginState } from "../types";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(loginAction, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden bg-[var(--som-primary-50)] lg:block">
        <Image
          src="/images/so_maya_ci_1763665764_3770224151622122471_13316418128.jpg"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover"
          style={{ objectPosition: "center 25%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_50%,rgba(0,0,0,0.55)_100%)]"
        />
        <p className="absolute bottom-10 left-10 m-0 text-[11px] uppercase tracking-[0.3em] text-white/85">
          La qualité, notre référence
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[380px]">
          <Image
            src="/images/logo_header.png"
            alt="SO'MAYA"
            width={1072}
            height={291}
            priority
            className="h-9 w-auto"
          />
          <p className="m-0 mt-10 text-[11px] uppercase tracking-[0.28em] text-[var(--som-primary)]">
            Espace administration
          </p>
          <h1 className="m-0 mt-2 text-[28px] font-semibold text-[var(--som-ink)]">Connexion</h1>
          <p className="m-0 mt-1.5 text-[14px] font-light text-[var(--som-gray)]">
            Accédez à la gestion de votre boutique.
          </p>

          {state.error && (
            <p
              role="alert"
              className="m-0 mt-8 bg-[var(--som-error-tint)] px-4 py-3 text-[13px] text-[var(--som-error)]"
            >
              {state.error}
            </p>
          )}

          <form action={formAction} className="mt-8 flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="label-som">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@somaya.ci"
                className="input-som"
              />
            </div>
            <div>
              <label htmlFor="password" className="label-som">
                Mot de passe
              </label>
              <div className="input-group-som">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="input-som !pl-4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="flex w-12 shrink-0 cursor-pointer items-center justify-center text-[var(--som-gray)] hover:text-[var(--som-ink)]"
                >
                  {showPassword ? <EyeOff size={17} strokeWidth={1.5} /> : <Eye size={17} strokeWidth={1.5} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isPending} className="btn-primary mt-3 w-full">
              {isPending && <Loader2 size={16} className="animate-spin" aria-hidden />}
              {isPending ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
