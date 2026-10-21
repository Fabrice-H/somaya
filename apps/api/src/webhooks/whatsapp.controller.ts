import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  PayloadTooLargeException,
  Post,
  Query,
  type RawBodyRequest,
  Req,
  Res,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { WHATSAPP_MAX_BODY_BYTES, WHATSAPP_SIGNATURE_HEADER } from "@somaya/core/features/whatsapp/constants";
import { getWebhookSecrets } from "@somaya/core/features/whatsapp/server/config";
import { applyStatuses, storeInbound } from "@somaya/core/features/whatsapp/server/service";
import { parseWebhookPayload, verifyChallenge, verifyMetaSignature } from "@somaya/core/features/whatsapp/webhook";
import { rawBodyOf } from "./headers";

@Controller("webhooks")
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  @Get("whatsapp")
  verify(@Query() query: Record<string, string>, @Res() response: Response) {
    const secrets = getWebhookSecrets();
    if (!secrets) throw new ServiceUnavailableException("not_configured");
    const result = verifyChallenge(new URLSearchParams(query), secrets.verifyToken);
    if (!result.ok) throw new ForbiddenException("verification_failed");
    response.type("text/plain").send(result.challenge);
  }

  @Post("whatsapp")
  @HttpCode(200)
  async receive(@Req() request: RawBodyRequest<Request>) {
    const secrets = getWebhookSecrets();
    if (!secrets) throw new ServiceUnavailableException("not_configured");

    const rawBody = rawBodyOf(request);
    if (rawBody.length > WHATSAPP_MAX_BODY_BYTES) throw new PayloadTooLargeException("payload_too_large");
    const signature = request.header(WHATSAPP_SIGNATURE_HEADER) ?? null;
    if (!verifyMetaSignature(secrets.appSecret, rawBody, signature))
      throw new UnauthorizedException("invalid_signature");

    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      throw new BadRequestException("invalid_payload");
    }

    const parsed = parseWebhookPayload(payload);
    const outcomes: string[] = [];
    try {
      for (const message of parsed.messages) outcomes.push(await storeInbound(message));
      if (parsed.statuses.length > 0) await applyStatuses(parsed.statuses);
    } catch (error) {
      this.logger.error("Webhook WhatsApp en échec", error instanceof Error ? error.stack : String(error));
    }
    return { received: true, messages: outcomes, statuses: parsed.statuses.length };
  }
}
