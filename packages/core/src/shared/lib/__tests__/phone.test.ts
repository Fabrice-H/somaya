import { describe, expect, it } from "vitest";
import { formatPhone, normalizePhone } from "../phone";

describe("normalizePhone", () => {
  it.each([
    ["0701020304", "+2250701020304"],
    ["07 01 02 03 04", "+2250701020304"],
    ["+225 07 01 02 03 04", "+2250701020304"],
    ["+2250701020304", "+2250701020304"],
    ["2250701020304", "+2250701020304"],
    ["00225 0701020304", "+2250701020304"],
    ["07-01-02-03-04", "+2250701020304"],
    ["2722334455", "+2252722334455"],
  ])("normalise %s", (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it.each(["", "  ", "12345", "701020304", "07010203041", "+33612345678", "abcdefghij"])("rejette %s", (input) => {
    expect(normalizePhone(input)).toBeNull();
  });

  it("accepte null et undefined", () => {
    expect(normalizePhone(null)).toBeNull();
    expect(normalizePhone(undefined)).toBeNull();
  });
});

describe("formatPhone", () => {
  it("affiche le numéro national par paires", () => {
    expect(formatPhone("+2250701020304")).toBe("07 01 02 03 04");
    expect(formatPhone("0701020304")).toBe("07 01 02 03 04");
  });

  it("laisse une valeur invalide telle quelle", () => {
    expect(formatPhone("12345")).toBe("12 34 5");
    expect(formatPhone(null)).toBe("");
  });
});
