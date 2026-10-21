import type { Metadata } from "next";
import { RegisterForm } from "@/features/account/components/RegisterForm";

export const metadata: Metadata = {
  title: "Créer mon compte | SO'MAYA",
  robots: { index: false },
};

type Params = Record<"next" | "order" | "firstName" | "lastName" | "phone" | "email", string | undefined>;

const safeNext = (value: unknown) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "";
const safeOrder = (value: unknown) =>
  typeof value === "string" && /^SM-\d{8}-[A-Z0-9]{4}$/i.test(value) ? value.toUpperCase() : "";
const text = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : "");

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Partial<Params>> }) {
  const params = await searchParams;
  return (
    <RegisterForm
      next={safeNext(params.next)}
      orderNumber={safeOrder(params.order)}
      defaults={{
        firstName: text(params.firstName, 100),
        lastName: text(params.lastName, 100),
        phone: text(params.phone, 30),
        email: text(params.email, 255),
      }}
    />
  );
}
