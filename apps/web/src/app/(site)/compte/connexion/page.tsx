import type { Metadata } from "next";
import { CustomerLoginForm } from "@/features/account/components/CustomerLoginForm";

export const metadata: Metadata = {
  title: "Connexion | SO'MAYA",
  robots: { index: false },
};

const safeNext = (value: unknown) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "";

export default async function CustomerLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <CustomerLoginForm next={safeNext(next)} />;
}
