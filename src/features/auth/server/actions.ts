"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { consumeRateLimit, getClientIp, resetRateLimit } from "@/shared/lib/rate-limit";
import { LOGIN_RATE_LIMIT } from "../constants";
import { loginSchema } from "../schemas";
import type { LoginState } from "../types";
import { signIn } from "./auth";

const TOO_MANY_ATTEMPTS = "Trop de tentatives. Réessayez dans 15 minutes.";

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const ip = await getClientIp();
  const keys = [`login:ip:${ip}`, `login:email:${parsed.data.email}`];
  if (!keys.every((key) => consumeRateLimit(key, LOGIN_RATE_LIMIT))) return { error: TOO_MANY_ATTEMPTS };

  try {
    await signIn("credentials", { ...parsed.data, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Email ou mot de passe incorrect" };
    throw error;
  }

  keys.forEach(resetRateLimit);
  redirect("/admin");
}
