import type { IncomingHttpHeaders } from "node:http";

export function toHeaders(incoming: IncomingHttpHeaders): Headers {
  const headers = new Headers();
  for (const [name, value] of Object.entries(incoming)) {
    if (Array.isArray(value)) headers.set(name, value.join(", "));
    else if (typeof value === "string") headers.set(name, value);
  }
  return headers;
}

export function rawBodyOf(request: { rawBody?: Buffer; body?: unknown }): string {
  if (request.rawBody) return request.rawBody.toString("utf8");
  return typeof request.body === "string" ? request.body : JSON.stringify(request.body ?? "");
}
