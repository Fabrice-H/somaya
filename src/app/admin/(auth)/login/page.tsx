"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/features/admin/auth/actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf6f1] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#511F29] tracking-wide">
            SO&apos;MAYA
          </h1>
          <p className="text-sm text-[#511F29]/60 mt-2">Administration</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-medium text-[#511F29] mb-6 text-center">
            Connexion
          </h2>

          {state.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#511F29]/80 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-[#511F29]/20
                         focus:outline-none focus:ring-2 focus:ring-[#511F29]/30
                         text-[#511F29] placeholder:text-[#511F29]/40"
                placeholder="admin@somaya.ci"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#511F29]/80 mb-1.5"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#511F29]/20
                           focus:outline-none focus:ring-2 focus:ring-[#511F29]/30
                           text-[#511F29] placeholder:text-[#511F29]/40 pr-12"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#511F29]/50
                           hover:text-[#511F29] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 rounded-lg bg-[#511F29] text-white font-medium
                       hover:bg-[#511F29]/90 transition-colors disabled:opacity-50
                       disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#511F29]/50 mt-6">
          &copy; {new Date().getFullYear()} SO&apos;MAYA. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
