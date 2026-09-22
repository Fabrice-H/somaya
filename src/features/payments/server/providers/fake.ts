import "server-only";
import { randomUUID } from "node:crypto";
import { FAKE_CHECKOUT_PATH } from "../../constants";
import { verifyHmacSignature } from "../../transitions";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
  ProviderPaymentState,
  WebhookParseResult,
} from "../../types";

const outcomes = new Map<string, ProviderPaymentState>();

export const FAKE_WEBHOOK_SECRET = "fake-webhook-secret-for-local-tests";

export function recordFakeOutcome(providerReference: string, state: ProviderPaymentState) {
  outcomes.set(providerReference, state);
}

export class FakeProvider implements PaymentProvider {
  readonly id = "fake" as const;

  constructor(private readonly siteUrl: string) {}

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const providerReference = `fake_${randomUUID()}`;
    outcomes.set(providerReference, {
      status: "pending",
      amount: input.amount,
      paymentMethod: null,
      failureReason: null,
      raw: null,
    });
    const url = new URL(FAKE_CHECKOUT_PATH, this.siteUrl);
    url.searchParams.set("ref", providerReference);
    url.searchParams.set("amount", String(input.amount));
    url.searchParams.set("success", input.successUrl);
    url.searchParams.set("error", input.errorUrl);
    return { providerReference, checkoutUrl: url.toString(), raw: { providerReference } };
  }

  async verifyPayment(providerReference: string): Promise<ProviderPaymentState> {
    return (
      outcomes.get(providerReference) ?? {
        status: "pending",
        amount: null,
        paymentMethod: null,
        failureReason: null,
        raw: null,
      }
    );
  }

  async parseWebhook(rawBody: string, headers: Headers): Promise<WebhookParseResult> {
    if (!verifyHmacSignature(FAKE_WEBHOOK_SECRET, rawBody, headers.get("jeko-signature"))) {
      return { ok: false, reason: "signature" };
    }
    const json = JSON.parse(rawBody) as { id: string; reference: string; status: "paid" | "failed"; amount: number };
    return {
      ok: true,
      webhook: {
        eventId: json.id,
        reference: json.reference,
        providerReference: null,
        state: { status: json.status, amount: json.amount, paymentMethod: "fake", failureReason: null, raw: json },
      },
    };
  }
}
