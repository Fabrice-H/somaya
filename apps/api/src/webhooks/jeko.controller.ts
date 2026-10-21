import {
  BadRequestException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Logger,
  PayloadTooLargeException,
  Post,
  type RawBodyRequest,
  Req,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { getPaymentProvider } from "@somaya/core/features/payments/server/registry";
import { handleWebhook } from "@somaya/core/features/payments/server/service";
import { rawBodyOf, toHeaders } from "./headers";

const MAX_BODY_BYTES = 64 * 1024;

@Controller("webhooks")
export class JekoController {
  private readonly logger = new Logger(JekoController.name);

  @Post("jeko")
  @HttpCode(200)
  async handle(@Req() request: RawBodyRequest<Request>) {
    const provider = getPaymentProvider("jeko");
    if (!provider) throw new ServiceUnavailableException("provider_not_configured");

    const rawBody = rawBodyOf(request);
    if (rawBody.length > MAX_BODY_BYTES) throw new PayloadTooLargeException("payload_too_large");

    const parsed = await provider.parseWebhook(rawBody, toHeaders(request.headers));
    if (!parsed.ok) {
      if (parsed.reason === "signature") throw new UnauthorizedException("invalid_signature");
      if (parsed.reason === "ignored") return { received: true, ignored: true };
      throw new BadRequestException("invalid_payload");
    }

    try {
      const outcome = await handleWebhook(provider, parsed.webhook);
      return { received: true, outcome };
    } catch (error) {
      this.logger.error("Webhook Jèko en échec", error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException("processing_failed");
    }
  }
}
