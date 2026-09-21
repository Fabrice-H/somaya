"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/features/auth/server/actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#3c161e] tracking-wide">
            SO&apos;MAYA
          </h1>
          <p className="text-sm text-[#3c161e]/60 mt-2">Administration</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-medium text-[#3c161e] mb-6 text-center">
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
                className="block text-sm font-medium text-[#3c161e]/80 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-black
                         focus:outline-none focus:ring-2 focus:ring-black/10
                         text-[#3c161e] placeholder:text-[#3c161e]/40"
                placeholder="admin@somaya.ci"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#3c161e]/80 mb-1.5"
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
                  className="w-full px-4 py-3 rounded-lg border border-black
                           focus:outline-none focus:ring-2 focus:ring-black/10
                           text-[#3c161e] placeholder:text-[#3c161e]/40 pr-12"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3c161e]/50
                           hover:text-[#3c161e] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 rounded-lg bg-[#511f29] text-white font-medium
                       hover:bg-[#511f29]/90 transition-colors disabled:opacity-50
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
        <p className="text-center text-xs text-[#3c161e]/50 mt-6">
          &copy; {new Date().getFullYear()} SO&apos;MAYA. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
