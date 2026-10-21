import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildVendiaHeaders, hasAttemptsLeft, isRetryable, retryDelayMs, signVendiaBody } from "../signature";
import { VENDIA_MAX_ATTEMPTS, VENDIA_RETRY_BASE_MS, VENDIA_RETRY_MAX_MS } from "../constants";

const secret = "whsec_test_secret";
const body = JSON.stringify({ event: "order.created", customer: { phone: "+2250700000000" } });

describe("signVendiaBody", () => {
  it("matches HMAC-SHA256 of `<timestamp>.<raw body>` in hex", () => {
    const expected = createHmac("sha256", secret).update(`1700000000.${body}`).digest("hex");
    expect(signVendiaBody(secret, 1700000000, body)).toBe(expected);
  });

  it("changes when the body or timestamp changes", () => {
    const base = signVendiaBody(secret, 1700000000, body);
    expect(signVendiaBody(secret, 1700000001, body)).not.toBe(base);
    expect(signVendiaBody(secret, 1700000000, `${body} `)).not.toBe(base);
  });
});

describe("buildVendiaHeaders", () => {
  it("sends the bearer key, a unix-seconds timestamp and the signature", () => {
    const headers = buildVendiaHeaders("sk_live_abc", secret, body, 1700000000_500);
    expect(headers.Authorization).toBe("Bearer sk_live_abc");
    expect(headers["X-Timestamp"]).toBe("1700000000");
    expect(headers["X-Signature"]).toBe(signVendiaBody(secret, 1700000000, body));
    expect(headers["Content-Type"]).toBe("application/json");
  });
});

describe("retry policy", () => {
  it("backs off exponentially and caps the delay", () => {
    expect(retryDelayMs(1)).toBe(VENDIA_RETRY_BASE_MS);
    expect(retryDelayMs(2)).toBe(VENDIA_RETRY_BASE_MS * 2);
    expect(retryDelayMs(20)).toBe(VENDIA_RETRY_MAX_MS);
  });

  it("retries network errors and server errors only", () => {
    expect(isRetryable(null)).toBe(true);
    expect(isRetryable(503)).toBe(true);
    expect(isRetryable(429)).toBe(true);
    expect(isRetryable(401)).toBe(false);
    expect(isRetryable(400)).toBe(false);
  });

  it("stops after the maximum number of attempts", () => {
    expect(hasAttemptsLeft(VENDIA_MAX_ATTEMPTS - 1)).toBe(true);
    expect(hasAttemptsLeft(VENDIA_MAX_ATTEMPTS)).toBe(false);
  });
});
