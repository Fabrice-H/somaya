import "server-only";
import { z } from "zod";
import { JEKO_REQUEST_TIMEOUT_MS, JEKO_SIGNATURE_HEADER } from "../../constants";
import { mapJekoStatus, verifyHmacSignature } from "../../transitions";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
  ProviderPaymentState,
  WebhookParseResult,
} from "../../types";
import type { JekoConfig } from "../config";

const createResponseSchema = z.object({
  id: z.string().min(1),
  redirectUrl: z.string().url(),
  status: z.string().optional(),
});

const amountSchema = z.object({ amount: z.number(), currency: z.string().optional() }).partial();

const transactionSchema = z
  .object({
    id: z.string().optional(),
    status: z.string().optional(),
    amount: amountSchema.optional(),
    paymentMethod: z.string().nullable().optional(),
    errorReason: z
      .union([z.string(), z.object({ id: z.string().optional() })])
      .nullable()
      .optional(),
    transactionDetails: z
      .object({ id: z.string().optional(), reference: z.string().optional(), paymentLinkId: z.string().optional() })
      .partial()
      .optional(),
  })
  .passthrough();

const paymentRequestSchema = z
  .object({
    id: z.string(),
    reference: z.string().optional(),
    status: z.string().optional(),
    paymentMethod: z.string().nullable().optional(),
    errorReason: z
      .union([z.string(), z.object({ id: z.string().optional() })])
      .nullable()
      .optional(),
    transaction: transactionSchema.nullable().optional(),
  })
  .passthrough();

const reasonOf = (value: unknown): string | null => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value && typeof value.id === "string") return value.id;
  return null;
};

const centsToAmount = (cents: number | undefined): number | null => (typeof cents === "number" ? cents / 100 : null);

export class JekoProvider implements PaymentProvider {
  readonly id = "jeko" as const;

  constructor(private readonly config: JekoConfig) {}

  private async request<T>(path: string, init: RequestInit, schema: z.ZodType<T>): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), JEKO_REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(`${this.config.apiBase}${path}`, {
        ...init,
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          "x-api-key": this.config.apiKey,
          "x-api-key-id": this.config.apiKeyId,
          ...(init.headers ?? {}),
        },
        signal: controller.signal,
        cache: "no-store",
      });
      const text = await response.text();
      const json: unknown = text ? JSON.parse(text) : null;
      if (!response.ok) {
        const reason = reasonOf(
          (json as { id?: unknown; error?: unknown } | null)?.id ?? (json as { error?: unknown } | null)?.error
        );
        throw new Error(`Jèko ${response.status}${reason ? ` (${reason})` : ""}`);
      }
      return schema.parse(json);
    } finally {
      clearTimeout(timer);
    }
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const body = {
      storeId: this.config.storeId,
      amountCents: Math.round(input.amount) * 100,
      currency: input.currency,
      reference: input.reference,
      description: input.description,
      paymentDetails: {
        type: "redirect",
        data: { paymentMethod: input.paymentMethod, successUrl: input.successUrl, errorUrl: input.errorUrl },
      },
      customer: {
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        phone: input.customer.phone,
        ...(input.customer.email ? { email: input.customer.email } : {}),
      },
      metadata: { reference: input.reference },
    };
    const data = await this.request(
      "/payment_requests",
      { method: "POST", body: JSON.stringify(body) },
      createResponseSchema
    );
    return { providerReference: data.id, checkoutUrl: data.redirectUrl, raw: data };
  }

  async verifyPayment(providerReference: string): Promise<ProviderPaymentState> {
    const data = await this.request(
      `/payment_requests/${encodeURIComponent(providerReference)}`,
      { method: "GET" },
      paymentRequestSchema
    );
    const transaction = data.transaction ?? null;
    return {
      status: mapJekoStatus(transaction?.status ?? data.status),
      amount: centsToAmount(transaction?.amount?.amount),
      paymentMethod: transaction?.paymentMethod ?? data.paymentMethod ?? null,
      failureReason: reasonOf(transaction?.errorReason ?? data.errorReason),
      raw: data,
    };
  }

  async parseWebhook(rawBody: string, headers: Headers): Promise<WebhookParseResult> {
    if (!verifyHmacSignature(this.config.webhookSecret, rawBody, headers.get(JEKO_SIGNATURE_HEADER))) {
      return { ok: false, reason: "signature" };
    }
    let json: unknown;
    try {
      json = JSON.parse(rawBody);
    } catch {
      return { ok: false, reason: "payload" };
    }
    if (json && typeof json === "object" && "event" in json && "payload" in json)
      return { ok: false, reason: "ignored" };

    const parsed = transactionSchema.safeParse(json);
    if (!parsed.success || !parsed.data.id) return { ok: false, reason: "payload" };
    const transaction = parsed.data;
    return {
      ok: true,
      webhook: {
        eventId: transaction.id!,
        reference: transaction.transactionDetails?.reference ?? null,
        providerReference: transaction.transactionDetails?.id ?? null,
        state: {
          status: mapJekoStatus(transaction.status),
          amount: centsToAmount(transaction.amount?.amount),
          paymentMethod: transaction.paymentMethod ?? null,
          failureReason: reasonOf(transaction.errorReason),
          raw: transaction,
        },
      },
    };
  }
}
