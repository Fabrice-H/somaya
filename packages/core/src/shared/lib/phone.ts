const COUNTRY_CODE = "225";
const NATIONAL_LENGTH = 10;
const NATIONAL_PREFIXES = ["0", "2"];

export const localPhone = (value: string) => value.replace(/^\+?225\s*/, "");
export const telHref = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;
export const whatsappHref = (value: string, message?: string) =>
  `https://wa.me/${value.replace(/\D/g, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export function normalizePhone(value: string | null | undefined): string | null {
  if (!value) return null;
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith(`00${COUNTRY_CODE}`) && digits.length === NATIONAL_LENGTH + 5) digits = digits.slice(5);
  else if (digits.startsWith(COUNTRY_CODE) && digits.length === NATIONAL_LENGTH + 3) digits = digits.slice(3);
  if (digits.length !== NATIONAL_LENGTH || !NATIONAL_PREFIXES.includes(digits[0])) return null;
  return `+${COUNTRY_CODE}${digits}`;
}

export function formatPhone(value: string | null | undefined): string {
  const normalized = normalizePhone(value);
  const national = normalized ? normalized.slice(COUNTRY_CODE.length + 1) : (value ?? "");
  return national.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}
