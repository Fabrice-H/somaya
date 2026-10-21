import { describe, expect, it } from "vitest";
import { adjustItemStock, clampStock, shortfallWarning } from "../adjust";

const items = [
  { id: "a", stock: 5, image: "a.jpg" },
  { id: "b", stock: 1, image: "b.jpg" },
];

describe("adjustItemStock", () => {
  it("décrémente l'article visé sans toucher aux autres", () => {
    const result = adjustItemStock(items, "a", -2);
    expect(result.found).toBe(true);
    expect(result.before).toBe(5);
    expect(result.after).toBe(3);
    expect(result.items).toEqual([
      { id: "a", stock: 3, image: "a.jpg" },
      { id: "b", stock: 1, image: "b.jpg" },
    ]);
  });

  it("ne descend jamais sous zéro", () => {
    expect(adjustItemStock(items, "b", -4).after).toBe(0);
  });

  it("restitue le stock", () => {
    expect(adjustItemStock(items, "b", 3).after).toBe(4);
  });

  it("signale un article introuvable sans modifier la liste", () => {
    const result = adjustItemStock(items, "zzz", -1);
    expect(result.found).toBe(false);
    expect(result.items).toBe(items);
  });
});

describe("clampStock", () => {
  it("borne à zéro et arrondit", () => {
    expect(clampStock(-3)).toBe(0);
    expect(clampStock(2.6)).toBe(3);
  });
});

describe("shortfallWarning", () => {
  it("ne signale rien quand le stock suffit", () => {
    expect(shortfallWarning("Sac", 3, 3)).toBeNull();
  });

  it("décrit un stock insuffisant ou une rupture", () => {
    expect(shortfallWarning("Sac", 1, 2)).toContain("1 disponible");
    expect(shortfallWarning("Sac", 0, 1)).toContain("rupture");
  });
});
