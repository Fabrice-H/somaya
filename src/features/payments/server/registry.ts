import "server-only";
import type { PaymentProvider, PaymentProviderId } from "../types";
import { getConfiguredProviderId, getJekoConfig, getPublicSiteUrl } from "./config";
import { FakeProvider } from "./providers/fake";
import { JekoProvider } from "./providers/jeko";

export function isOnlinePaymentEnabled(): boolean {
  return getConfiguredProviderId() !== null;
}

export function getPaymentProvider(id?: PaymentProviderId | string | null): PaymentProvider | null {
  const target = id ?? getConfiguredProviderId();
  if (target === "jeko") {
    const config = getJekoConfig();
    return config ? new JekoProvider(config) : null;
  }
  if (target === "fake") return getConfiguredProviderId() === "fake" ? new FakeProvider(getPublicSiteUrl()) : null;
  return null;
}
