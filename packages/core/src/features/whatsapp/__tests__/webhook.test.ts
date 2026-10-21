import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { isWithinHours, parseWebhookPayload, verifyChallenge, verifyMetaSignature } from "../webhook";

const secret = "app-secret";
const sign = (body: string) => `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;

describe("verifyMetaSignature", () => {
  it("accepte une signature Meta valide et refuse les autres", () => {
    const body = '{"object":"whatsapp_business_account"}';
    expect(verifyMetaSignature(secret, body, sign(body))).toBe(true);
    expect(verifyMetaSignature(secret, body, sign(body).toUpperCase())).toBe(true);
    expect(verifyMetaSignature(secret, body, null)).toBe(false);
    expect(verifyMetaSignature(secret, body, "sha256=00")).toBe(false);
    expect(verifyMetaSignature(secret, body + " ", sign(body))).toBe(false);
    expect(verifyMetaSignature("autre", body, sign(body))).toBe(false);
  });
});

describe("verifyChallenge", () => {
  it("renvoie le challenge quand le jeton correspond", () => {
    const query = new URLSearchParams({ "hub.mode": "subscribe", "hub.verify_token": "abc", "hub.challenge": "12345" });
    expect(verifyChallenge(query, "abc")).toEqual({ ok: true, challenge: "12345" });
    expect(verifyChallenge(query, "xyz")).toEqual({ ok: false });
    expect(verifyChallenge(new URLSearchParams({ "hub.mode": "unsubscribe" }), "abc")).toEqual({ ok: false });
  });
});

describe("parseWebhookPayload", () => {
  const payload = {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            field: "messages",
            value: {
              contacts: [{ wa_id: "2250700000001", profile: { name: "Awa" } }],
              messages: [
                {
                  id: "wamid.1",
                  from: "2250700000001",
                  timestamp: "1700000000",
                  type: "text",
                  text: { body: "Bonjour" },
                },
                {
                  id: "wamid.2",
                  from: "2250700000001",
                  timestamp: "1700000001",
                  type: "image",
                  image: { id: "media-1", caption: "Ce modèle ?" },
                },
                {
                  id: "wamid.3",
                  from: "2250700000001",
                  type: "interactive",
                  interactive: { button_reply: { title: "Oui" } },
                },
              ],
              statuses: [{ id: "wamid.out", status: "delivered", timestamp: "1700000002" }],
            },
          },
        ],
      },
    ],
  };

  it("extrait messages, nom du contact, média et statuts", () => {
    const parsed = parseWebhookPayload(payload);
    expect(parsed.messages).toHaveLength(3);
    expect(parsed.messages[0]).toMatchObject({
      waMessageId: "wamid.1",
      waId: "2250700000001",
      profileName: "Awa",
      body: "Bonjour",
    });
    expect(parsed.messages[1]).toMatchObject({ type: "image", mediaId: "media-1", body: "Ce modèle ?" });
    expect(parsed.messages[2].body).toBe("Oui");
    expect(parsed.statuses).toEqual([
      { waMessageId: "wamid.out", status: "delivered", timestamp: new Date(1700000002 * 1000) },
    ]);
  });

  it("ignore les payloads inattendus", () => {
    expect(parseWebhookPayload(null)).toEqual({ messages: [], statuses: [] });
    expect(parseWebhookPayload({ entry: [{ changes: [{ field: "account_update", value: {} }] }] })).toEqual({
      messages: [],
      statuses: [],
    });
  });
});

describe("isWithinHours", () => {
  it("compare l'heure d'Abidjan aux horaires", () => {
    const at = (hour: number) => new Date(Date.UTC(2026, 9, 5, hour, 30));
    expect(isWithinHours(at(10), 9, 19)).toBe(true);
    expect(isWithinHours(at(21), 9, 19)).toBe(false);
    expect(isWithinHours(at(2), 22, 6)).toBe(true);
    expect(isWithinHours(at(12), 0, 0)).toBe(true);
  });
});
