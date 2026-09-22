export type PaymentProviderId = "jeko" | "fake";

export type PaymentStatus = "pending" | "processing" | "paid" | "failed" | "cancelled" | "refunded";

export type OrderChannel = "whatsapp" | "online";

export type OnlineOperator = "wave" | "orange" | "mtn" | "moov" | "djamo";

export type CreatePaymentInput = {
  reference: string;
  paymentMethod: OnlineOperator;
  amount: number;
  currency: string;
  description: string;
  successUrl: string;
  errorUrl: string;
  customer: { firstName: string; lastName: string; phone: string; email: string | null };
};

export type CreatePaymentResult = {
  providerReference: string;
  checkoutUrl: string;
  raw: unknown;
};

export type ProviderPaymentState = {
  status: PaymentStatus;
  amount: number | null;
  paymentMethod: string | null;
  failureReason: string | null;
  raw: unknown;
};

export type ParsedWebhook = {
  eventId: string;
  reference: string | null;
  providerReference: string | null;
  state: ProviderPaymentState;
};

export type WebhookParseResult =
  { ok: true; webhook: ParsedWebhook } | { ok: false; reason: "signature" | "payload" | "ignored" };

export interface PaymentProvider {
  id: PaymentProviderId;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(providerReference: string): Promise<ProviderPaymentState>;
  parseWebhook(rawBody: string, headers: Headers): Promise<WebhookParseResult>;
}

export type PaymentDto = {
  id: string;
  provider: PaymentProviderId;
  provider_reference: string | null;
  reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: string | null;
  failure_reason: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type StartPaymentResult = { ok: true; checkoutUrl: string } | { ok: false; error: string };

export type PaymentReturnView =
  | { kind: "paid"; orderNumber: string; total: number; firstName: string; hasAccount: boolean }
  | { kind: "pending"; orderNumber: string; total: number; firstName: string }
  | { kind: "failed"; orderNumber: string; total: number; firstName: string; reason: string | null }
  | { kind: "unknown" };
