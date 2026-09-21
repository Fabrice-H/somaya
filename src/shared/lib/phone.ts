export const localPhone = (value: string) => value.replace(/^\+?225\s*/, "");
export const telHref = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;
export const whatsappHref = (value: string, message?: string) =>
  `https://wa.me/${value.replace(/\D/g, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
