import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FakeCheckout } from "@/features/payments/components/FakeCheckout";
import { getConfiguredProviderId, getPublicSiteUrl } from "@/features/payments/server/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Paiement de test | SO'MAYA",
  robots: { index: false, follow: false },
};

type Params = Record<"ref" | "amount" | "success" | "error", string | undefined>;

const sameOrigin = (value: string | undefined) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.origin === new URL(getPublicSiteUrl()).origin ? url.toString() : null;
  } catch {
    return null;
  }
};

export default async function FakeCheckoutPage({ searchParams }: { searchParams: Promise<Partial<Params>> }) {
  if (getConfiguredProviderId() !== "fake") notFound();
  const params = await searchParams;
  const successUrl = sameOrigin(params.success);
  const errorUrl = sameOrigin(params.error);
  if (!params.ref?.startsWith("fake_") || !successUrl || !errorUrl) notFound();
  return (
    <FakeCheckout
      providerReference={params.ref}
      amount={Number(params.amount ?? 0)}
      successUrl={successUrl}
      errorUrl={errorUrl}
    />
  );
}
