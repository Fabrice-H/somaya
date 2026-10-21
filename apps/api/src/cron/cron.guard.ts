import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";
import type { Request } from "express";
import { loadEnv } from "../env";

@Injectable()
export class CronGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const expected = Buffer.from(`Bearer ${loadEnv().CRON_SECRET}`);
    const received = Buffer.from(request.headers.authorization ?? "");
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
