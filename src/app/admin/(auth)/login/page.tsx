import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Connexion | Admin SO'MAYA",
  robots: { index: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
