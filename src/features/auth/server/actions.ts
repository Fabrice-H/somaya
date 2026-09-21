"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { loginSchema } from "../schemas";
import type { LoginState } from "../types";
import { signIn } from "./auth";

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  try {
    await signIn("credentials", { ...parsed.data, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Email ou mot de passe incorrect" };
    throw error;
  }

  redirect("/admin");
}
