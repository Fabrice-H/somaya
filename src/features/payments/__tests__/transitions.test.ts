import { describe, expect, it } from "vitest";
import { amountsMatch, canTransition, hmacSha256Hex, mapJekoStatus, verifyHmacSignature } from "../transitions";

describe("canTransition", () => {
  it("avance seulement vers l'avant", () => {
    expect(canTransition("pending", "processing")).toBe(true);
    expect(canTransition("pending", "paid")).toBe(true);
    expect(canTransition("processing", "failed")).toBe(true);
    expect(canTransition("paid", "pending")).toBe(false);
    expect(canTransition("paid", "failed")).toBe(false);
    expect(canTransition("paid", "paid")).toBe(false);
  });

  it("autorise un paiement réussi après un échec (nouvelle tentative) et un remboursement après paiement", () => {
    expect(canTransition("failed", "paid")).toBe(true);
    expect(canTransition("cancelled", "paid")).toBe(true);
    expect(canTransition("paid", "refunded")).toBe(true);
    expect(canTransition("refunded", "paid")).toBe(false);
  });
});

describe("amountsMatch", () => {
  it("compare les montants arrondis et tolère l'absence de montant", () => {
    expect(amountsMatch(12000, 12000)).toBe(true);
    expect(amountsMatch(12000, 11999.6)).toBe(true);
    expect(amountsMatch(12000, 10000)).toBe(false);
    expect(amountsMatch(12000, null)).toBe(true);
  });
});

describe("signature HMAC", () => {
  const secret = "s3cret";
  const body = '{"id":"txn_1","status":"success"}';

  it("accepte une signature valide, en hexadécimal minuscule ou majuscule", () => {
    const signature = hmacSha256Hex(secret, body);
    expect(verifyHmacSignature(secret, body, signature)).toBe(true);
    expect(verifyHmacSignature(secret, body, signature.toUpperCase())).toBe(true);
  });

  it("refuse une signature absente, altérée ou calculée sur un autre corps", () => {
    const signature = hmacSha256Hex(secret, body);
    expect(verifyHmacSignature(secret, body, null)).toBe(false);
    expect(verifyHmacSignature(secret, body, signature.replace(/^./, "0"))).toBe(false);
    expect(verifyHmacSignature(secret, body + " ", signature)).toBe(false);
    expect(verifyHmacSignature("autre", body, signature)).toBe(false);
  });
});

describe("mapJekoStatus", () => {
  it("traduit les statuts Jèko", () => {
    expect(mapJekoStatus("success")).toBe("paid");
    expect(mapJekoStatus("error")).toBe("failed");
    expect(mapJekoStatus("pending")).toBe("pending");
    expect(mapJekoStatus(undefined)).toBe("pending");
  });
});
